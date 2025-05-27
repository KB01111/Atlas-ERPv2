import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase-client';

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
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

    // Parse query parameters
    const searchParams = url.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Calculate offset
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase.from('documents').select(
      `
        id,
        title,
        description,
        file_name,
        file_size,
        file_type,
        tags,
        created_at,
        updated_at,
        uploaded_by,
        profiles:uploaded_by (
          first_name,
          last_name,
          email
        )
      `,
      { count: 'exact' }
    );

    // Apply filters
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,description.ilike.%${search}%,file_name.ilike.%${search}%`
      );
    }

    if (tags.length > 0) {
      query = query.contains('tags', tags);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: documents, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch documents' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Calculate pagination info
    const totalPages = Math.ceil((count || 0) / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return new Response(
      JSON.stringify({
        documents: documents || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Fetch documents error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
