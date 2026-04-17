'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        toast.success('Authentication successful', {
          description: 'Welcome to the Velour Admin Dashboard.',
        });
        router.push('/admin');
        router.refresh(); // Force a refresh to update the middleware state
      } else {
        const data = await res.json();
        toast.error('Authentication failed', {
          description: data.error || 'Invalid credentials provided.',
        });
        setPassword('');
      }
    } catch {
      toast.error('Network Error', {
        description: 'Failed to reach the authentication server.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0805', // Velour darkest dark
        color: '#f5f0e8',
        fontFamily: 'var(--font-jost)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '3rem 2rem',
          background: '#120e0a',
          border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '2rem',
            color: '#7c3aed',
            letterSpacing: '0.1em',
            marginBottom: '0.5rem',
          }}
        >
          HQ TERMINAL
        </h1>
        <p style={{ color: 'rgba(245,240,232,0.6)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Authorized personnel only.
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ textAlign: 'left' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.8rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#7c3aed',
              }}
            >
              Access Code
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(124,58,237,0.3)',
                color: '#f5f0e8',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#7c3aed')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(124,58,237,0.3)')}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.8rem',
              background: '#7c3aed',
              color: '#0a0805',
              border: 'none',
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'background 0.2s',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginTop: '0.5rem',
            }}
            onMouseOver={(e) => {
              if (!loading) e.currentTarget.style.background = '#9d6ef5';
            }}
            onMouseOut={(e) => {
              if (!loading) e.currentTarget.style.background = '#7c3aed';
            }}
          >
            {loading ? 'Authenticating...' : 'Enter System'}
          </button>
        </form>
      </div>
    </div>
  );
}
