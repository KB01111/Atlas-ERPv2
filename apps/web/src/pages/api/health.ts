import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    const services = {
      api: 'healthy',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      environment: import.meta.env.NODE_ENV || 'development',
    };

    return new Response(JSON.stringify(services), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Health check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
