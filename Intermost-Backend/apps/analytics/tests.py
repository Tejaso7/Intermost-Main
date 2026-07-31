from datetime import datetime, timedelta, timezone
from django.test import TestCase, RequestFactory
from django.urls import reverse, resolve
import json

from apps.analytics import views


class AnalyticsAPITestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_parse_iso_datetime(self):
        dt1 = views.parse_iso_datetime("2026-07-01")
        self.assertEqual(dt1, datetime(2026, 7, 1, 0, 0, 0))

        dt2 = views.parse_iso_datetime("2026-07-31", is_end_of_day=True)
        self.assertEqual(dt2, datetime(2026, 7, 31, 23, 59, 59, 999999))

        dt3 = views.parse_iso_datetime("2026-07-15T14:30:00Z")
        self.assertEqual(dt3, datetime(2026, 7, 15, 14, 30, 0))

    def test_build_filter_query_iso_dates(self):
        request = self.factory.get('/api/v1/analytics/summary/?date_from=2026-07-01&date_to=2026-07-31')
        query = views.build_filter_query(request)
        
        self.assertIn('timestamp', query)
        self.assertEqual(query['timestamp']['$gte'], datetime(2026, 7, 1, 0, 0, 0))
        self.assertEqual(query['timestamp']['$lte'], datetime(2026, 7, 31, 23, 59, 59, 999999))

    def test_build_filter_query_days_fallback(self):
        request = self.factory.get('/api/v1/analytics/summary/?days=7')
        query = views.build_filter_query(request)
        
        self.assertIn('timestamp', query)
        self.assertIn('$gte', query['timestamp'])
        self.assertNotIn('$lte', query['timestamp'])

    def test_activity_patterns_url_routing(self):
        resolver = resolve('/api/v1/analytics/activity-patterns/')
        self.assertEqual(resolver.func, views.get_activity_patterns)
        self.assertEqual(resolver.url_name, 'activity_patterns')

    def test_get_activity_patterns_view(self):
        request = self.factory.get('/api/v1/analytics/activity-patterns/?date_from=2026-07-01&date_to=2026-07-31')
        response = views.get_activity_patterns(request)
        
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        
        self.assertEqual(data.get('status'), 'success')
        self.assertTrue(data.get('success'))
        self.assertIn('heatmap', data)
        self.assertEqual(len(data['heatmap']), 7)
        self.assertEqual(len(data['heatmap'][0]), 24)
        
        self.assertIn('session_buckets', data)
        for bucket in ['0-30s', '30s-2m', '2-5m', '5-15m', '15m+']:
            self.assertIn(bucket, data['session_buckets'])
            
        self.assertIn('peak_hour', data)
        self.assertIsInstance(data['peak_hour'], int)
        self.assertIn('peak_day', data)
        self.assertIsInstance(data['peak_day'], str)
        
        self.assertIn('new_vs_returning', data)
        self.assertIn('new', data['new_vs_returning'])
        self.assertIn('returning', data['new_vs_returning'])

    def test_get_location_stats_view(self):
        request = self.factory.get('/api/v1/analytics/locations/?country=India&city=Delhi&page=1&page_size=10')
        response = views.get_location_stats(request)
        
        self.assertEqual(response.status_code, 200)
        data = response.data
        
        self.assertIn('locations', data)
        self.assertIn('pagination', data)
        pagination = data['pagination']
        self.assertEqual(pagination['page'], 1)
        self.assertEqual(pagination['page_size'], 10)
        self.assertIn('total_pages', pagination)
        self.assertIn('total_items', pagination)

    def test_get_analytics_summary_view(self):
        request = self.factory.get('/api/v1/analytics/summary/')
        response = views.get_analytics_summary(request)
        
        self.assertEqual(response.status_code, 200)
        data = response.data
        
        self.assertIn('most_active_hour', data)
        self.assertIn('most_active_day', data)
        self.assertIn('avg_session_duration_seconds', data)
