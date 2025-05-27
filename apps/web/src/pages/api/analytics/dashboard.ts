import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase-client';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.substring(7);

    // Verify user session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get dashboard metrics
    const [documentsCount, projectsCount, tasksCount, usersCount, recentActivity, storageUsage] =
      await Promise.all([
        // Documents count
        supabase.from('documents').select('id', { count: 'exact', head: true }),

        // Projects count
        supabase.from('projects').select('id', { count: 'exact', head: true }),

        // Tasks count
        supabase.from('tasks').select('id', { count: 'exact', head: true }),

        // Users count
        supabase.from('profiles').select('id', { count: 'exact', head: true }),

        // Recent activity (last 7 days)
        supabase
          .from('activity_logs')
          .select('*')
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false })
          .limit(10),

        // Storage usage
        supabase.from('documents').select('file_size'),
      ]);

    // Calculate storage usage
    const totalStorageBytes =
      storageUsage.data?.reduce((sum, doc) => sum + (doc.file_size || 0), 0) || 0;
    const totalStorageMB = Math.round((totalStorageBytes / (1024 * 1024)) * 100) / 100;

    // Get monthly trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: monthlyTrends } = await supabase
      .from('documents')
      .select('created_at')
      .gte('created_at', sixMonthsAgo.toISOString());

    // Process monthly trends
    const monthlyData = {};
    monthlyTrends?.forEach(doc => {
      const month = new Date(doc.created_at).toISOString().substring(0, 7); // YYYY-MM
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    const trends = Object.entries(monthlyData)
      .map(([month, count]) => ({
        month,
        documents: count,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    // Calculate growth rates (mock data for now)
    const currentMonth = new Date().toISOString().substring(0, 7);
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 7);

    const currentMonthDocs = monthlyData[currentMonth] || 0;
    const lastMonthDocs = monthlyData[lastMonth] || 0;
    const documentGrowth =
      lastMonthDocs > 0 ? ((currentMonthDocs - lastMonthDocs) / lastMonthDocs) * 100 : 0;

    const dashboardData = {
      metrics: {
        totalDocuments: documentsCount.count || 0,
        totalProjects: projectsCount.count || 0,
        totalTasks: tasksCount.count || 0,
        totalUsers: usersCount.count || 0,
        storageUsed: totalStorageMB,
        documentGrowth: Math.round(documentGrowth * 100) / 100,
      },
      recentActivity: recentActivity.data || [],
      trends: trends,
      systemHealth: {
        database: 'healthy',
        storage: 'healthy',
        api: 'healthy',
        lastUpdated: new Date().toISOString(),
      },
    };

    return new Response(JSON.stringify(dashboardData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
