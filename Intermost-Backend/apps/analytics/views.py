"""
Analytics Views - Handles visitor tracking and analytics data
"""
import json
import hashlib
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from bson import ObjectId
import requests

from apps.mongodb import get_collection


def get_client_ip(request):
    """Get client IP address from request"""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR', '127.0.0.1')
    return ip


def get_location_from_ip(ip):
    """Get location data from IP using free IP-API service"""
    try:
        if ip in ('127.0.0.1', 'localhost', '::1'):
            return {
                'country': 'Local',
                'country_code': 'LC',
                'city': 'Local',
                'region': 'Local',
                'lat': 0,
                'lon': 0,
            }
        
        response = requests.get(f'http://ip-api.com/json/{ip}?fields=status,country,countryCode,city,region,lat,lon', timeout=3)
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'success':
                return {
                    'country': data.get('country', 'Unknown'),
                    'country_code': data.get('countryCode', 'XX'),
                    'city': data.get('city', 'Unknown'),
                    'region': data.get('region', 'Unknown'),
                    'lat': data.get('lat', 0),
                    'lon': data.get('lon', 0),
                }
    except Exception as e:
        print(f"Error getting location: {e}")
    
    return {
        'country': 'Unknown',
        'country_code': 'XX',
        'city': 'Unknown',
        'region': 'Unknown',
        'lat': 0,
        'lon': 0,
    }


def parse_user_agent(user_agent):
    """Parse user agent string to extract device and browser info"""
    user_agent = user_agent.lower() if user_agent else ''
    
    # Detect device type
    if 'mobile' in user_agent or 'android' in user_agent or 'iphone' in user_agent:
        device_type = 'mobile'
    elif 'tablet' in user_agent or 'ipad' in user_agent:
        device_type = 'tablet'
    else:
        device_type = 'desktop'
    
    # Detect browser
    if 'chrome' in user_agent and 'edg' not in user_agent:
        browser = 'Chrome'
    elif 'firefox' in user_agent:
        browser = 'Firefox'
    elif 'safari' in user_agent and 'chrome' not in user_agent:
        browser = 'Safari'
    elif 'edg' in user_agent:
        browser = 'Edge'
    elif 'opera' in user_agent or 'opr' in user_agent:
        browser = 'Opera'
    else:
        browser = 'Other'
    
    # Detect OS
    if 'windows' in user_agent:
        os = 'Windows'
    elif 'mac' in user_agent:
        os = 'macOS'
    elif 'linux' in user_agent:
        os = 'Linux'
    elif 'android' in user_agent:
        os = 'Android'
    elif 'iphone' in user_agent or 'ipad' in user_agent:
        os = 'iOS'
    else:
        os = 'Other'
    
    return {
        'device_type': device_type,
        'browser': browser,
        'os': os,
    }


def generate_visitor_id(ip, user_agent):
    """Generate a unique visitor ID from IP and user agent"""
    data = f"{ip}:{user_agent}"
    return hashlib.md5(data.encode()).hexdigest()[:16]


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def track_pageview(request):
    """Track a pageview from the frontend"""
    try:
        data = request.data
        ip = get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        
        visitor_id = generate_visitor_id(ip, user_agent)
        location = get_location_from_ip(ip)
        device_info = parse_user_agent(user_agent)
        
        pageviews = get_collection('pageviews')
        visitors = get_collection('visitors')
        
        now = datetime.utcnow()
        today = now.replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Create pageview record
        pageview = {
            'visitor_id': visitor_id,
            'page_url': data.get('url', '/'),
            'page_title': data.get('title', ''),
            'referrer': data.get('referrer', ''),
            'ip_address': ip,
            'user_agent': user_agent,
            'location': location,
            'device': device_info,
            'session_id': data.get('session_id', ''),
            'timestamp': now,
            'date': today,
        }
        pageviews.insert_one(pageview)
        
        # Update or create visitor record
        existing_visitor = visitors.find_one({'visitor_id': visitor_id})
        if existing_visitor:
            # Update existing visitor
            visitors.update_one(
                {'visitor_id': visitor_id},
                {
                    '$set': {
                        'last_seen': now,
                        'location': location,
                    },
                    '$inc': {'pageviews': 1}
                }
            )
        else:
            # Create new visitor
            visitor = {
                'visitor_id': visitor_id,
                'ip_address': ip,
                'user_agent': user_agent,
                'location': location,
                'device': device_info,
                'first_seen': now,
                'last_seen': now,
                'pageviews': 1,
            }
            visitors.insert_one(visitor)
        
        # Update daily stats
        daily_stats = get_collection('daily_stats')
        daily_stats.update_one(
            {'date': today},
            {
                '$inc': {
                    'pageviews': 1,
                    f'locations.{location["country"]}': 1,
                    f'browsers.{device_info["browser"]}': 1,
                    f'devices.{device_info["device_type"]}': 1,
                },
                '$addToSet': {'unique_visitors': visitor_id}
            },
            upsert=True
        )
        
        return Response({'success': True, 'visitor_id': visitor_id})
    
    except Exception as e:
        print(f"Error tracking pageview: {e}")
        return Response({'success': False, 'error': str(e)}, status=500)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_analytics_summary(request):
    """Get analytics summary for the dashboard"""
    try:
        pageviews = get_collection('pageviews')
        visitors = get_collection('visitors')
        daily_stats = get_collection('daily_stats')
        
        now = datetime.utcnow()
        today = now.replace(hour=0, minute=0, second=0, microsecond=0)
        yesterday = today - timedelta(days=1)
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)
        
        # Get today's stats
        today_pageviews = pageviews.count_documents({'date': today})
        today_visitors = len(list(pageviews.distinct('visitor_id', {'date': today})))
        
        # Get yesterday's stats for comparison
        yesterday_pageviews = pageviews.count_documents({'date': yesterday})
        yesterday_visitors = len(list(pageviews.distinct('visitor_id', {'date': yesterday})))
        
        # Get total stats
        total_pageviews = pageviews.count_documents({})
        total_visitors = visitors.count_documents({})
        
        # Get this week's stats
        week_pageviews = pageviews.count_documents({'date': {'$gte': week_ago}})
        week_visitors = len(list(pageviews.distinct('visitor_id', {'date': {'$gte': week_ago}})))
        
        # Get this month's stats
        month_pageviews = pageviews.count_documents({'date': {'$gte': month_ago}})
        month_visitors = len(list(pageviews.distinct('visitor_id', {'date': {'$gte': month_ago}})))
        
        # Calculate changes
        pageview_change = ((today_pageviews - yesterday_pageviews) / max(yesterday_pageviews, 1)) * 100
        visitor_change = ((today_visitors - yesterday_visitors) / max(yesterday_visitors, 1)) * 100
        
        return Response({
            'today': {
                'pageviews': today_pageviews,
                'visitors': today_visitors,
                'pageview_change': round(pageview_change, 1),
                'visitor_change': round(visitor_change, 1),
            },
            'week': {
                'pageviews': week_pageviews,
                'visitors': week_visitors,
            },
            'month': {
                'pageviews': month_pageviews,
                'visitors': month_visitors,
            },
            'total': {
                'pageviews': total_pageviews,
                'visitors': total_visitors,
            },
        })
    
    except Exception as e:
        print(f"Error getting analytics summary: {e}")
        return Response({
            'today': {'pageviews': 0, 'visitors': 0, 'pageview_change': 0, 'visitor_change': 0},
            'week': {'pageviews': 0, 'visitors': 0},
            'month': {'pageviews': 0, 'visitors': 0},
            'total': {'pageviews': 0, 'visitors': 0},
        })


@api_view(['GET'])
@permission_classes([AllowAny])
def get_visitor_stats(request):
    """Get visitor statistics"""
    try:
        visitors = get_collection('visitors')
        pageviews = get_collection('pageviews')
        
        days = int(request.GET.get('days', 30))
        now = datetime.utcnow()
        start_date = now - timedelta(days=days)
        
        # Get daily visitor counts
        pipeline = [
            {'$match': {'timestamp': {'$gte': start_date}}},
            {'$group': {
                '_id': {'$dateToString': {'format': '%Y-%m-%d', 'date': '$timestamp'}},
                'visitors': {'$addToSet': '$visitor_id'},
                'pageviews': {'$sum': 1}
            }},
            {'$project': {
                'date': '$_id',
                'visitors': {'$size': '$visitors'},
                'pageviews': 1,
                '_id': 0
            }},
            {'$sort': {'date': 1}}
        ]
        
        daily_data = list(pageviews.aggregate(pipeline))
        
        # Get new vs returning visitors
        new_visitors = visitors.count_documents({'first_seen': {'$gte': start_date}})
        total_active = len(list(pageviews.distinct('visitor_id', {'timestamp': {'$gte': start_date}})))
        returning_visitors = max(0, total_active - new_visitors)
        
        return Response({
            'daily': daily_data,
            'new_visitors': new_visitors,
            'returning_visitors': returning_visitors,
            'total_active': total_active,
        })
    
    except Exception as e:
        print(f"Error getting visitor stats: {e}")
        return Response({'daily': [], 'new_visitors': 0, 'returning_visitors': 0, 'total_active': 0})


@api_view(['GET'])
@permission_classes([AllowAny])
def get_pageview_stats(request):
    """Get pageview statistics"""
    try:
        pageviews = get_collection('pageviews')
        
        days = int(request.GET.get('days', 30))
        now = datetime.utcnow()
        start_date = now - timedelta(days=days)
        
        # Get hourly distribution for today
        today = now.replace(hour=0, minute=0, second=0, microsecond=0)
        hourly_pipeline = [
            {'$match': {'timestamp': {'$gte': today}}},
            {'$group': {
                '_id': {'$hour': '$timestamp'},
                'count': {'$sum': 1}
            }},
            {'$sort': {'_id': 1}}
        ]
        hourly_data = list(pageviews.aggregate(hourly_pipeline))
        
        # Format hourly data
        hours = {h['_id']: h['count'] for h in hourly_data}
        hourly_formatted = [{'hour': i, 'pageviews': hours.get(i, 0)} for i in range(24)]
        
        # Get daily pageviews
        daily_pipeline = [
            {'$match': {'timestamp': {'$gte': start_date}}},
            {'$group': {
                '_id': {'$dateToString': {'format': '%Y-%m-%d', 'date': '$timestamp'}},
                'count': {'$sum': 1}
            }},
            {'$sort': {'_id': 1}}
        ]
        daily_data = list(pageviews.aggregate(daily_pipeline))
        
        return Response({
            'hourly': hourly_formatted,
            'daily': [{'date': d['_id'], 'pageviews': d['count']} for d in daily_data],
        })
    
    except Exception as e:
        print(f"Error getting pageview stats: {e}")
        return Response({'hourly': [], 'daily': []})


@api_view(['GET'])
@permission_classes([AllowAny])
def get_location_stats(request):
    """Get visitor location statistics"""
    try:
        visitors = get_collection('visitors')
        pageviews = get_collection('pageviews')
        
        days = int(request.GET.get('days', 30))
        now = datetime.utcnow()
        start_date = now - timedelta(days=days)
        
        # Get visitor counts by country
        country_pipeline = [
            {'$match': {'timestamp': {'$gte': start_date}}},
            {'$group': {
                '_id': '$location.country',
                'visitors': {'$addToSet': '$visitor_id'},
                'pageviews': {'$sum': 1}
            }},
            {'$project': {
                'country': '$_id',
                'visitors': {'$size': '$visitors'},
                'pageviews': 1,
                '_id': 0
            }},
            {'$sort': {'visitors': -1}},
            {'$limit': 20}
        ]
        
        by_country = list(pageviews.aggregate(country_pipeline))
        
        # Get visitor counts by city
        city_pipeline = [
            {'$match': {'timestamp': {'$gte': start_date}}},
            {'$group': {
                '_id': {
                    'city': '$location.city',
                    'country': '$location.country'
                },
                'visitors': {'$addToSet': '$visitor_id'},
                'pageviews': {'$sum': 1}
            }},
            {'$project': {
                'city': '$_id.city',
                'country': '$_id.country',
                'visitors': {'$size': '$visitors'},
                'pageviews': 1,
                '_id': 0
            }},
            {'$sort': {'visitors': -1}},
            {'$limit': 20}
        ]
        
        by_city = list(pageviews.aggregate(city_pipeline))
        
        # Get location coordinates for map
        locations_pipeline = [
            {'$match': {'timestamp': {'$gte': start_date}, 'location.lat': {'$ne': 0}}},
            {'$group': {
                '_id': {
                    'lat': '$location.lat',
                    'lon': '$location.lon',
                    'city': '$location.city',
                    'country': '$location.country'
                },
                'count': {'$sum': 1}
            }},
            {'$project': {
                'lat': '$_id.lat',
                'lon': '$_id.lon',
                'city': '$_id.city',
                'country': '$_id.country',
                'count': 1,
                '_id': 0
            }},
            {'$limit': 100}
        ]
        
        locations = list(pageviews.aggregate(locations_pipeline))
        
        return Response({
            'by_country': by_country,
            'by_city': by_city,
            'locations': locations,
        })
    
    except Exception as e:
        print(f"Error getting location stats: {e}")
        return Response({'by_country': [], 'by_city': [], 'locations': []})


@api_view(['GET'])
@permission_classes([AllowAny])
def get_top_pages(request):
    """Get top viewed pages"""
    try:
        pageviews = get_collection('pageviews')
        
        days = int(request.GET.get('days', 30))
        limit = int(request.GET.get('limit', 10))
        now = datetime.utcnow()
        start_date = now - timedelta(days=days)
        
        pipeline = [
            {'$match': {'timestamp': {'$gte': start_date}}},
            {'$group': {
                '_id': '$page_url',
                'views': {'$sum': 1},
                'visitors': {'$addToSet': '$visitor_id'}
            }},
            {'$project': {
                'page': '$_id',
                'views': 1,
                'visitors': {'$size': '$visitors'},
                '_id': 0
            }},
            {'$sort': {'views': -1}},
            {'$limit': limit}
        ]
        
        top_pages = list(pageviews.aggregate(pipeline))
        
        return Response({'pages': top_pages})
    
    except Exception as e:
        print(f"Error getting top pages: {e}")
        return Response({'pages': []})


@api_view(['GET'])
@permission_classes([AllowAny])
def get_device_stats(request):
    """Get device and browser statistics"""
    try:
        pageviews = get_collection('pageviews')
        
        days = int(request.GET.get('days', 30))
        now = datetime.utcnow()
        start_date = now - timedelta(days=days)
        
        # Get device type distribution
        device_pipeline = [
            {'$match': {'timestamp': {'$gte': start_date}}},
            {'$group': {
                '_id': '$device.device_type',
                'count': {'$sum': 1}
            }},
            {'$sort': {'count': -1}}
        ]
        
        by_device = [{'device': d['_id'] or 'Unknown', 'count': d['count']} 
                     for d in pageviews.aggregate(device_pipeline)]
        
        # Get browser distribution
        browser_pipeline = [
            {'$match': {'timestamp': {'$gte': start_date}}},
            {'$group': {
                '_id': '$device.browser',
                'count': {'$sum': 1}
            }},
            {'$sort': {'count': -1}}
        ]
        
        by_browser = [{'browser': b['_id'] or 'Unknown', 'count': b['count']} 
                      for b in pageviews.aggregate(browser_pipeline)]
        
        # Get OS distribution
        os_pipeline = [
            {'$match': {'timestamp': {'$gte': start_date}}},
            {'$group': {
                '_id': '$device.os',
                'count': {'$sum': 1}
            }},
            {'$sort': {'count': -1}}
        ]
        
        by_os = [{'os': o['_id'] or 'Unknown', 'count': o['count']} 
                 for o in pageviews.aggregate(os_pipeline)]
        
        return Response({
            'by_device': by_device,
            'by_browser': by_browser,
            'by_os': by_os,
        })
    
    except Exception as e:
        print(f"Error getting device stats: {e}")
        return Response({'by_device': [], 'by_browser': [], 'by_os': []})


@api_view(['GET'])
@permission_classes([AllowAny])
def get_realtime_visitors(request):
    """Get real-time visitor count (last 5 minutes)"""
    try:
        pageviews = get_collection('pageviews')
        
        now = datetime.utcnow()
        five_minutes_ago = now - timedelta(minutes=5)
        
        # Get active visitors in last 5 minutes
        active_visitors = len(list(pageviews.distinct('visitor_id', {'timestamp': {'$gte': five_minutes_ago}})))
        
        # Get their pages
        pipeline = [
            {'$match': {'timestamp': {'$gte': five_minutes_ago}}},
            {'$sort': {'timestamp': -1}},
            {'$group': {
                '_id': '$visitor_id',
                'page': {'$first': '$page_url'},
                'location': {'$first': '$location.country'},
            }},
            {'$limit': 10}
        ]
        
        active_pages = list(pageviews.aggregate(pipeline))
        
        return Response({
            'active_visitors': active_visitors,
            'active_pages': active_pages,
        })
    
    except Exception as e:
        print(f"Error getting realtime visitors: {e}")
        return Response({'active_visitors': 0, 'active_pages': []})


@api_view(['GET'])
@permission_classes([AllowAny])
def get_trends(request):
    """Get traffic trends comparison"""
    try:
        pageviews = get_collection('pageviews')
        
        now = datetime.utcnow()
        today = now.replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Compare this week vs last week
        this_week_start = today - timedelta(days=today.weekday())
        last_week_start = this_week_start - timedelta(days=7)
        last_week_end = this_week_start
        
        this_week_views = pageviews.count_documents({'timestamp': {'$gte': this_week_start}})
        last_week_views = pageviews.count_documents({
            'timestamp': {'$gte': last_week_start, '$lt': last_week_end}
        })
        
        week_change = ((this_week_views - last_week_views) / max(last_week_views, 1)) * 100
        
        # Compare this month vs last month
        this_month_start = today.replace(day=1)
        last_month_end = this_month_start
        last_month_start = (this_month_start - timedelta(days=1)).replace(day=1)
        
        this_month_views = pageviews.count_documents({'timestamp': {'$gte': this_month_start}})
        last_month_views = pageviews.count_documents({
            'timestamp': {'$gte': last_month_start, '$lt': last_month_end}
        })
        
        month_change = ((this_month_views - last_month_views) / max(last_month_views, 1)) * 100
        
        return Response({
            'this_week': this_week_views,
            'last_week': last_week_views,
            'week_change': round(week_change, 1),
            'this_month': this_month_views,
            'last_month': last_month_views,
            'month_change': round(month_change, 1),
        })
    
    except Exception as e:
        print(f"Error getting trends: {e}")
        return Response({
            'this_week': 0, 'last_week': 0, 'week_change': 0,
            'this_month': 0, 'last_month': 0, 'month_change': 0
        })
