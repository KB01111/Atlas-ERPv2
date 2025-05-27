import React, { useState } from 'react';

interface User {
  id: string;
  email: string;
  user_metadata?: Record<string, unknown>;
}

interface LoginFormProps {
  onSuccess?: (user: User) => void;
  onError?: (error: string) => void;
}

export default function LoginForm({ onSuccess, onError }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store session in localStorage
      if (data.session) {
        localStorage.setItem('supabase_session', JSON.stringify(data.session));
      }

      onSuccess?.(data.user);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-md mx-auto bg-card p-6 rounded-lg border'>
      <h2 className='text-2xl font-bold text-center mb-6'>Sign In</h2>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='email' className='block text-sm font-medium mb-2'>
            Email
          </label>
          <input
            id='email'
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
            placeholder='Enter your email'
          />
        </div>

        <div>
          <label htmlFor='password' className='block text-sm font-medium mb-2'>
            Password
          </label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className='w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
            placeholder='Enter your password'
          />
        </div>

        {error && (
          <div className='bg-destructive/10 border border-destructive text-destructive px-3 py-2 rounded-md text-sm'>
            {error}
          </div>
        )}

        <button
          type='submit'
          disabled={isLoading}
          className='w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className='mt-4 text-center'>
        <p className='text-sm text-muted-foreground'>
          Don&apos;t have an account?{' '}
          <a href='/register' className='text-primary hover:underline'>
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
