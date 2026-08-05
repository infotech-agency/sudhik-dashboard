import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getApiError } from '@/api/client';

export function Login() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      toast('Welcome back, Admin', 'success');
      navigate('/');
    } catch (err) {
      toast(getApiError(err, 'Login failed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-maroon-800 p-12 text-cream-100 lg:flex">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, #C9A227 0, transparent 50%), radial-gradient(circle at 80% 70%, #C9A227 0, transparent 40%)' }} />
        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500 text-maroon-900">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-wide">SHUDDHIK</h1>
              <p className="text-[10px] uppercase tracking-[0.25em] text-gold-400">Premium Temple Cleaner</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <p className="font-serif text-4xl font-semibold leading-tight text-cream-50">
            Sacred surfaces,<br />pristine care.
          </p>
          <p className="mt-4 max-w-sm text-cream-200/80">
            Administer your premium product catalog, orders, and customers from one elegant control center.
          </p>
        </div>
        <div className="relative text-xs text-maroon-300">
          &copy; {new Date().getFullYear()} SHUDDHIK&trade;. All rights reserved.
        </div>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center bg-cream-100 p-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-maroon-700 text-gold-400">
              <Sparkles className="h-6 w-6" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-maroon-800">SHUDDHIK</h1>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold-600">Admin Panel</p>
          </div>

          <div className="card p-8">
            <h2 className="font-serif text-2xl font-semibold text-maroon-900">Sign in</h2>
            <p className="mt-1 text-sm text-maroon-500">Enter your admin credentials to continue</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="email" className="label-field">Email address</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-maroon-300" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@shuddhik.com"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="label-field">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-maroon-300" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-maroon-300 hover:text-maroon-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-maroon-400">
            Protected admin area. Authorized personnel only.
          </p>
        </div>
      </div>
    </div>
  );
}
