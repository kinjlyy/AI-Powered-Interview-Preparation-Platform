import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await login(formData)
      localStorage.setItem('token', response.token)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignupRedirect = () => {
    navigate('/signup')
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-100 px-6 py-24">
      <div className="absolute inset-x-0 top-20 -z-10 flex justify-center">
        <div className="h-60 w-60 rounded-full bg-brand-200/30 blur-3xl" />
      </div>
      <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/90 p-8 shadow-card backdrop-blur">
        <div className="text-center">
          <p className="inline-flex items-center rounded-full bg-brand-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
            Welcome back
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">
            Sign in to InterviewPrep
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Continue your prep streak and keep momentum going.
          </p>
        </div>
        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-brand-600">Forgot password?</span>
          </div>
          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:-translate-y-0.5 hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={handleSignupRedirect}
            className="font-semibold text-brand-600 transition hover:text-brand-500 focus:outline-none"
          >
            Sign up
          </button>
        </p>
      </div>
    </section>
  )
}

export default Login


