"""
Analytics Views - Handles visitor tracking and analytics data
"""
import json
import hashlib
import math
from datetime import datetime, timedelta, timezone
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from bson import ObjectId
import requests

from apps.mongodb import get_collection


def parse_iso_datetime(date_str, is_end_of_day=False):
    """Parse ISO date string to UTC datetime object."""
    if not date_str:
        return None
    date_str = str(date_str).strip()
    clean_str = date_str.replace('Z', '+00:00')
    dt = datetime.fromisoformat(clean_str)
    
    if len(date_str) == 10:  # Format YYYY-MM-DD
        if is_end_of_day:
            dt = dt.replace(hour=23, minute=59, second=59, microsecond=999999)
        else:
            dt = dt.replace(hour=0, minute=0, second=0, microsecond=0)
            
    if dt.tzinfo is not None:
        dt = dt.astimezone(timezone.utc).replace(tzinfo=None)
        
    return dt


def build_filter_query(request):
    """Construct MongoDB matching filter query based on time range, channel source, and platform device."""
    query = {}
    timestamp_cond = {}
    
    date_from_str = request.GET.get('date_from')
    date_to_str = request.GET.get('date_to')
    
    if date_from_str:
        try:
            dt_from = parse_iso_datetime(date_from_str, is_end_of_day=False)
            if dt_from:
                timestamp_cond['$gte'] = dt_from
        except ValueError:
            pass
            
    if '$gte' not in timestamp_cond:
        days = int(request.GET.get('days', 30))
        start_date = datetime.utcnow() - timedelta(days=days)
        timestamp_cond['$gte'] = start_date

    if date_to_str:
        try:
            dt_to = parse_iso_datetime(date_to_str, is_end_of_day=True)
            if dt_to:
                timestamp_cond['$lte'] = dt_to
        except ValueError:
            pass

    if timestamp_cond:
        query['timestamp'] = timestamp_cond
        
    # Channel/Source Filter
    source = request.GET.get('source', 'all')
    if source == 'direct':
        query['referrer'] = ''
        query['page_url'] = {'$not': {'$regex': 'utm_source', '$options': 'i'}}
    elif source == 'whatsapp':
        query['$or'] = [
            {'referrer': {'$regex': 'whatsapp|wa\\.me', '$options': 'i'}},
            {'page_url': {'$regex': 'utm_source=whatsapp', '$options': 'i'}}
        ]
    elif source == 'search':
        query['$or'] = [
            {'referrer': {'$regex': 'google|bing|yahoo|baidu|yandex', '$options': 'i'}},
            {'page_url': {'$regex': 'utm_source=search', '$options': 'i'}}
        ]
    elif source == 'email':
        query['$or'] = [
            {'referrer': {'$regex': 'mail|outlook|gmail', '$options': 'i'}},
            {'page_url': {'$regex': 'utm_source=email|utm_medium=email', '$options': 'i'}}
        ]
        
    # Device Filter
    device = request.GET.get('device', 'all')
    if device in ('desktop', 'mobile', 'tablet'):
        query['device.device_type'] = device
        
    return query


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
    return hashlib.md5(data.encode()).hexdigest()[:16]  # nosec B324


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
        
        now = datetime.utcnow()
        today = now.replace(hour=0, minute=0, second=0, microsecond=0)
        yesterday = today - timedelta(days=1)
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)
        
        # Base query (filters by channel/device)
        base_query = {}
        source = request.GET.get('source', 'all')
        if source == 'direct':
            base_query['referrer'] = ''
            base_query['page_url'] = {'$not': {'$regex': 'utm_source', '$options': 'i'}}
        elif source == 'whatsapp':
            base_query['$or'] = [
                {'referrer': {'$regex': 'whatsapp|wa\\.me', '$options': 'i'}},
                {'page_url': {'$regex': 'utm_source=whatsapp', '$options': 'i'}}
            ]
        elif source == 'search':
            base_query['$or'] = [
                {'referrer': {'$regex': 'google|bing|yahoo|baidu|yandex', '$options': 'i'}},
                {'page_url': {'$regex': 'utm_source=search', '$options': 'i'}}
            ]
        elif source == 'email':
            base_query['$or'] = [
                {'referrer': {'$regex': 'mail|outlook|gmail', '$options': 'i'}},
                {'page_url': {'$regex': 'utm_source=email|utm_medium=email', '$options': 'i'}}
            ]
            
        device = request.GET.get('device', 'all')
        if device in ('desktop', 'mobile', 'tablet'):
            base_query['device.device_type'] = device

        # Get today's stats
        today_pageviews = pageviews.count_documents({**base_query, 'date': today})
        today_visitors = len(list(pageviews.distinct('visitor_id', {**base_query, 'date': today})))
        
        # Get yesterday's stats for comparison
        yesterday_pageviews = pageviews.count_documents({**base_query, 'date': yesterday})
        yesterday_visitors = len(list(pageviews.distinct('visitor_id', {**base_query, 'date': yesterday})))
        
        # Get total stats
        total_pageviews = pageviews.count_documents(base_query)
        total_visitors = len(list(pageviews.distinct('visitor_id', base_query)))
        
        # Get this week's stats
        week_pageviews = pageviews.count_documents({**base_query, 'date': {'$gte': week_ago}})
        week_visitors = len(list(pageviews.distinct('visitor_id', {**base_query, 'date': {'$gte': week_ago}})))
        
        # Get this month's stats
        month_pageviews = pageviews.count_documents({**base_query, 'date': {'$gte': month_ago}})
        month_visitors = len(list(pageviews.distinct('visitor_id', {**base_query, 'date': {'$gte': month_ago}})))
        
        # Calculate changes
        pageview_change = ((today_pageviews - yesterday_pageviews) / max(yesterday_pageviews, 1)) * 100
        visitor_change = ((today_visitors - yesterday_visitors) / max(yesterday_visitors, 1)) * 100
        
        filter_query = build_filter_query(request)
        
        # Calculate peak hour, peak day, and avg session duration
        hour_pipeline = [
            {'$match': filter_query},
            {'$group': {'_id': {'$hour': '$timestamp'}, 'count': {'$sum': 1}}},
            {'$sort': {'count': -1}},
            {'$limit': 1}
        ]
        top_hour_res = list(pageviews.aggregate(hour_pipeline))
        most_active_hour = top_hour_res[0]['_id'] if top_hour_res else 0
        
        day_pipeline = [
            {'$match': filter_query},
            {'$group': {'_id': {'$isoDayOfWeek': '$timestamp'}, 'count': {'$sum': 1}}},
            {'$sort': {'count': -1}},
            {'$limit': 1}
        ]
        DAYS_MAP = {1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday'}
        top_day_res = list(pageviews.aggregate(day_pipeline))
        most_active_day = DAYS_MAP.get(top_day_res[0]['_id'], 'N/A') if top_day_res else 'N/A'
        
        session_duration_pipeline = [
            {'$match': filter_query},
            {'$group': {
                '_id': {
                    'visitor_id': '$visitor_id',
                    'session_id': {'$ifNull': ['$session_id', '$visitor_id']}
                },
                'start_time': {'$min': '$timestamp'},
                'end_time': {'$max': '$timestamp'}
            }},
            {'$project': {
                'duration_seconds': {'$divide': [{'$subtract': ['$end_time', '$start_time']}, 1000]}
            }}
        ]
        sessions = list(pageviews.aggregate(session_duration_pipeline))
        total_duration = sum(s.get('duration_seconds', 0) or 0 for s in sessions)
        avg_session_duration_seconds = round(total_duration / max(len(sessions), 1), 1)

        return Response({
            'status': 'success',
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
            'most_active_hour': most_active_hour,
            'most_active_day': most_active_day,
            'avg_session_duration_seconds': avg_session_duration_seconds,
        })
    
    except Exception as e:
        print(f"Error getting analytics summary: {e}")
        return Response({
            'status': 'error',
            'today': {'pageviews': 0, 'visitors': 0, 'pageview_change': 0, 'visitor_change': 0},
            'week': {'pageviews': 0, 'visitors': 0},
            'month': {'pageviews': 0, 'visitors': 0},
            'total': {'pageviews': 0, 'visitors': 0},
            'most_active_hour': 0,
            'most_active_day': 'N/A',
            'avg_session_duration_seconds': 0.0,
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
        
        filter_query = build_filter_query(request)
        
        # Get daily visitor counts
        pipeline = [
            {'$match': filter_query},
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
        visitor_query = {'first_seen': {'$gte': start_date}}
        device = request.GET.get('device', 'all')
        if device in ('desktop', 'mobile', 'tablet'):
            visitor_query['device.device_type'] = device
            
        new_visitors = visitors.count_documents(visitor_query)
        total_active = len(list(pageviews.distinct('visitor_id', filter_query)))
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
        
        # Base filters
        base_query = {}
        source = request.GET.get('source', 'all')
        if source == 'direct':
            base_query['referrer'] = ''
            base_query['page_url'] = {'$not': {'$regex': 'utm_source', '$options': 'i'}}
        elif source == 'whatsapp':
            base_query['$or'] = [
                {'referrer': {'$regex': 'whatsapp|wa\\.me', '$options': 'i'}},
                {'page_url': {'$regex': 'utm_source=whatsapp', '$options': 'i'}}
            ]
        elif source == 'search':
            base_query['$or'] = [
                {'referrer': {'$regex': 'google|bing|yahoo|baidu|yandex', '$options': 'i'}},
                {'page_url': {'$regex': 'utm_source=search', '$options': 'i'}}
            ]
        elif source == 'email':
            base_query['$or'] = [
                {'referrer': {'$regex': 'mail|outlook|gmail', '$options': 'i'}},
                {'page_url': {'$regex': 'utm_source=email|utm_medium=email', '$options': 'i'}}
            ]
        device = request.GET.get('device', 'all')
        if device in ('desktop', 'mobile', 'tablet'):
            base_query['device.device_type'] = device

        # Get hourly distribution for today
        today = now.replace(hour=0, minute=0, second=0, microsecond=0)
        hourly_pipeline = [
            {'$match': {**base_query, 'timestamp': {'$gte': today}}},
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
        filter_query = build_filter_query(request)
        daily_pipeline = [
            {'$match': filter_query},
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
    """Get visitor location statistics with filtering and pagination"""
    try:
        pageviews = get_collection('pageviews')
        
        filter_query = build_filter_query(request)
        
        country_param = request.GET.get('country', '').strip()
        city_param = request.GET.get('city', '').strip()
        
        try:
            page = max(1, int(request.GET.get('page', 1)))
        except ValueError:
            page = 1
            
        try:
            page_size = max(1, int(request.GET.get('page_size', 20)))
        except ValueError:
            page_size = 20

        if country_param:
            filter_query['location.country'] = {'$regex': country_param, '$options': 'i'}
        if city_param:
            filter_query['location.city'] = {'$regex': city_param, '$options': 'i'}

        # Get visitor counts by country (top 20)
        country_pipeline = [
            {'$match': filter_query},
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

        # Get visitor counts by city (top 20)
        city_pipeline = [
            {'$match': filter_query},
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

        # Full paginated location table with coordinates and visit counts
        location_table_pipeline = [
            {'$match': filter_query},
            {'$group': {
                '_id': {
                    'city': '$location.city',
                    'country': '$location.country',
                    'region': '$location.region',
                    'lat': '$location.lat',
                    'lon': '$location.lon'
                },
                'visitors': {'$addToSet': '$visitor_id'},
                'visit_count': {'$sum': 1},
                'last_active': {'$max': '$timestamp'}
            }},
            {'$project': {
                'city': {'$ifNull': ['$_id.city', 'Unknown']},
                'country': {'$ifNull': ['$_id.country', 'Unknown']},
                'region': {'$ifNull': ['$_id.region', 'Unknown']},
                'lat': {'$ifNull': ['$_id.lat', 0.0]},
                'lon': {'$ifNull': ['$_id.lon', 0.0]},
                'visitors': {'$size': '$visitors'},
                'visit_count': 1,
                'pageviews': '$visit_count',
                'last_active': 1,
                '_id': 0
            }},
            {'$sort': {'visit_count': -1}}
        ]

        all_locations = list(pageviews.aggregate(location_table_pipeline))

        for loc in all_locations:
            if isinstance(loc.get('last_active'), datetime):
                loc['last_active'] = loc['last_active'].isoformat()

        total_items = len(all_locations)
        total_pages = math.ceil(total_items / page_size) if total_items > 0 else 1
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        paginated_locations = all_locations[start_idx:end_idx]

        pagination = {
            'page': page,
            'page_size': page_size,
            'total_pages': total_pages,
            'total_items': total_items,
            'total': total_items
        }

        return Response({
            'status': 'success',
            'by_country': by_country,
            'by_city': by_city,
            'locations': paginated_locations,
            'pagination': pagination
        })

    except Exception as e:
        print(f"Error getting location stats: {e}")
        return Response({
            'status': 'error',
            'by_country': [],
            'by_city': [],
            'locations': [],
            'pagination': {
                'page': 1,
                'page_size': 20,
                'total_pages': 0,
                'total_items': 0,
                'total': 0
            }
        })


@api_view(['GET'])
@permission_classes([AllowAny])
def get_top_pages(request):
    """Get top viewed pages"""
    try:
        pageviews = get_collection('pageviews')
        
        days = int(request.GET.get('days', 30))
        limit = int(request.GET.get('limit', 10))
        filter_query = build_filter_query(request)
        
        pipeline = [
            {'$match': filter_query},
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
        filter_query = build_filter_query(request)
        
        # Get device type distribution
        device_pipeline = [
            {'$match': filter_query},
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
            {'$match': filter_query},
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
            {'$match': filter_query},
            {'$group': {
                '_id': '$device.os',
                'count': {'$sum': 1}
            }},
            {'$sort': {'count': -1}}
        ]
        
        by_os = [{'os': o['_id'] or 'Unknown', 'count': o['count']} 
                 for o in pageviews.aggregate(os_pipeline)]
        
        # Get referrer distribution
        referrer_pipeline = [
            {'$match': filter_query},
            {'$group': {
                '_id': '$referrer',
                'count': {'$sum': 1}
            }},
            {'$sort': {'count': -1}}
        ]
        raw_referrers = list(pageviews.aggregate(referrer_pipeline))
        
        referrers_grouped = {
            'direct': 0,
            'whatsapp': 0,
            'search': 0,
            'email': 0,
            'other': 0
        }
        for r in raw_referrers:
            ref = (r['_id'] or '').lower()
            count = r['count']
            if not ref:
                referrers_grouped['direct'] += count
            elif 'whatsapp' in ref or 'wa.me' in ref:
                referrers_grouped['whatsapp'] += count
            elif any(s in ref for s in ('google', 'bing', 'yahoo', 'baidu', 'yandex')):
                referrers_grouped['search'] += count
            elif any(e in ref for e in ('mail', 'outlook', 'gmail')):
                referrers_grouped['email'] += count
            else:
                referrers_grouped['other'] += count
                
        by_referrer = [{'channel': k, 'count': v} for k, v in referrers_grouped.items()]
        
        return Response({
            'by_device': by_device,
            'by_browser': by_browser,
            'by_os': by_os,
            'by_referrer': by_referrer,
        })
    
    except Exception as e:
        print(f"Error getting device stats: {e}")
        return Response({'by_device': [], 'by_browser': [], 'by_os': [], 'by_referrer': []})


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


@api_view(['GET'])
@permission_classes([AllowAny])
def get_activity_patterns(request):
    """Get activity patterns including 7x24 heatmap, session durations, peak activity, and visitor split."""
    try:
        pageviews = get_collection('pageviews')
        visitors = get_collection('visitors')
        
        filter_query = build_filter_query(request)
        
        # 1. Build 7x24 heatmap matrix (Monday=0 to Sunday=6, Hour 0 to 23)
        heatmap = [[0 for _ in range(24)] for _ in range(7)]
        
        heatmap_pipeline = [
            {'$match': filter_query},
            {'$group': {
                '_id': {
                    'day': {'$isoDayOfWeek': '$timestamp'},
                    'hour': {'$hour': '$timestamp'}
                },
                'count': {'$sum': 1}
            }}
        ]
        
        for entry in pageviews.aggregate(heatmap_pipeline):
            day = entry['_id'].get('day')  # MongoDB $isoDayOfWeek returns 1 (Mon) to 7 (Sun)
            hour = entry['_id'].get('hour')  # 0 to 23
            if day is not None and hour is not None and 1 <= day <= 7 and 0 <= hour <= 23:
                heatmap[day - 1][hour] = entry['count']
                
        # 2. Compute peak_hour (0-23) and peak_day (e.g., "Monday")
        hourly_totals = [sum(heatmap[d][h] for d in range(7)) for h in range(24)]
        peak_hour = int(max(range(24), key=lambda h: hourly_totals[h])) if any(hourly_totals) else 0
        
        day_totals = [sum(heatmap[d]) for d in range(7)]
        day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        max_day_idx = int(max(range(7), key=lambda d: day_totals[d])) if any(day_totals) else 0
        peak_day = day_names[max_day_idx]
        
        # 3. Categorize sessions into duration histogram buckets: 0-30s, 30s-2m, 2-5m, 5-15m, 15m+
        session_pipeline = [
            {'$match': filter_query},
            {'$group': {
                '_id': {
                    'visitor_id': '$visitor_id',
                    'session_id': {'$ifNull': ['$session_id', '$visitor_id']}
                },
                'start_time': {'$min': '$timestamp'},
                'end_time': {'$max': '$timestamp'}
            }},
            {'$project': {
                'duration_seconds': {
                    '$divide': [{'$subtract': ['$end_time', '$start_time']}, 1000]
                }
            }}
        ]
        
        session_buckets = {
            '0-30s': 0,
            '30s-2m': 0,
            '2-5m': 0,
            '5-15m': 0,
            '15m+': 0
        }
        
        for session in pageviews.aggregate(session_pipeline):
            duration = session.get('duration_seconds', 0) or 0
            if duration < 30:
                session_buckets['0-30s'] += 1
            elif duration < 120:
                session_buckets['30s-2m'] += 1
            elif duration < 300:
                session_buckets['2-5m'] += 1
            elif duration < 900:
                session_buckets['5-15m'] += 1
            else:
                session_buckets['15m+'] += 1
                
        # 4. Compute new_vs_returning dict
        visitor_query = {}
        ts_cond = filter_query.get('timestamp', {})
        if '$gte' in ts_cond:
            visitor_query['first_seen'] = {'$gte': ts_cond['$gte']}
        if '$lte' in ts_cond:
            visitor_query['first_seen'] = visitor_query.get('first_seen', {})
            visitor_query['first_seen']['$lte'] = ts_cond['$lte']
            
        device = request.GET.get('device', 'all')
        if device in ('desktop', 'mobile', 'tablet'):
            visitor_query['device.device_type'] = device
            
        new_visitors = visitors.count_documents(visitor_query)
        total_active = len(list(pageviews.distinct('visitor_id', filter_query)))
        returning_visitors = max(0, total_active - new_visitors)
        
        new_vs_returning = {
            'new': new_visitors,
            'returning': returning_visitors,
            'new_visitors': new_visitors,
            'returning_visitors': returning_visitors,
            'total_visitors': total_active
        }
        
        return JsonResponse({
            'status': 'success',
            'success': True,
            'heatmap': heatmap,
            'session_buckets': session_buckets,
            'peak_hour': peak_hour,
            'peak_day': peak_day,
            'new_vs_returning': new_vs_returning
        })
        
    except Exception as e:
        print(f"Error getting activity patterns: {e}")
        return JsonResponse({
            'status': 'error',
            'error': str(e),
            'heatmap': [[0 for _ in range(24)] for _ in range(7)],
            'session_buckets': {'0-30s': 0, '30s-2m': 0, '2-5m': 0, '5-15m': 0, '15m+': 0},
            'peak_hour': 0,
            'peak_day': 'Monday',
            'new_vs_returning': {'new': 0, 'returning': 0, 'new_visitors': 0, 'returning_visitors': 0, 'total_visitors': 0}
        }, status=500)
