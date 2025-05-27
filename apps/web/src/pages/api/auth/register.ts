import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase-client';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 6 characters long' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName || '',
          last_name: lastName || '',
        }
      }
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Create user profile if registration successful
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            first_name: firstName || '',
            last_name: lastName || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't fail registration if profile creation fails
      }
    }

    return new Response(
      JSON.stringify({ 
        user: data.user,
        session: data.session,
        message: 'Registration successful. Please check your email for verification.'
      }),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
