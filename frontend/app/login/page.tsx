"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/app');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      login(token, user);
      router.push('/app');
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Login failed');
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-discord-bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-discord-brand"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://assets-global.website-files.com/6257adef93867e56f84d3092/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png')] bg-cover bg-center relative">
      
      <div className="absolute inset-0 bg-discord-bg-primary/90 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 bg-discord-bg-secondary rounded-md p-8 w-full max-w-[480px] shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-discord-text-header mb-2">Welcome Back!</h1>
          <p className="text-discord-text-muted">We&apos;re so excited to see you again!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2 tracking-wide">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 bg-discord-bg-tertiary border-none rounded-[3px] text-discord-text-normal placeholder-discord-text-muted focus:outline-none focus:ring-0 h-10"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-discord-text-muted uppercase mb-2 tracking-wide">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 bg-discord-bg-tertiary border-none rounded-[3px] text-discord-text-normal placeholder-discord-text-muted focus:outline-none focus:ring-0 h-10"
              required
            />
            <div className="mt-2">
              <Link
                href="/forgot-password"
                className="text-discord-text-link hover:underline text-xs font-medium"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          {error && (
            <div className="text-discord-text-danger text-xs font-medium mt-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-discord-brand hover:bg-discord-brand-hover disabled:opacity-50 text-white font-medium py-2.5 rounded-[3px] transition-colors duration-200 focus:outline-none mt-4"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="mt-4 text-left">
          <span className="text-discord-text-muted text-sm">
            Need an account?{' '}
            <Link href="/register" className="text-discord-text-link hover:underline font-medium">
              Register
            </Link>
          </span>
        </div>
      </motion.div>
    </div>
  );
}