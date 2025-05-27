import type { APIRoute } from 'astro';

export const prerender = false;

// CopilotKit API endpoint for Atlas ERP v2
// This will be enhanced with actual CopilotKit integration

export const POST: APIRoute = async ({ request }) => {
  try {
    const _body = await request.json();

    // Basic response structure for CopilotKit
    const response = {
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: 'atlas-erp-assistant',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: `Hello! I'm your Atlas ERP assistant. I can help you with:

🏢 **Business Operations**
- Financial analysis and reporting
- Project management insights
- Team performance metrics

📊 **Data Analysis**
- KPI tracking and visualization
- Document analysis and search
- Knowledge graph exploration

🤖 **AI Capabilities**
- Document processing and OCR
- Semantic search across your data
- Automated workflow suggestions

How can I assist you today?`,
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: 50,
        completion_tokens: 100,
        total_tokens: 150,
      },
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('CopilotKit API error:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
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

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ message: 'CopilotKit endpoint - use POST method' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
};
