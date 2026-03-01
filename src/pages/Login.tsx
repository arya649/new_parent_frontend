import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Eye, EyeOff } from 'lucide-react'
import { login } from '../api/parentApi'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(email, password)
      localStorage.setItem('access_token', data.access_token)
      navigate('/', { replace: true })
    } catch {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F0FDF4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fadeIn">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#16A34A] flex items-center justify-center shadow-lg mb-4">
            <GraduationCap size={28} className="text-white" />
          </div>
          <h1 className="text-[24px] font-extrabold text-[#111827]">School Attendance</h1>
          <p className="text-[14px] text-[#6B7280] mt-1">Sign in to track your child's attendance</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-4">
          {error && (
            <div className="bg-[#FEE2E2] border border-[#FECACA] rounded-xl px-4 py-3 text-[#7F1D1D] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-[15px]
                           text-[#111827] placeholder-[#9CA3AF] outline-none
                           focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-[#E2E8F0] text-[15px]
                             text-[#111827] placeholder-[#9CA3AF] outline-none
                             focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                >
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#16A34A] text-white font-bold text-[15px]
                         shadow-[0_2px_8px_rgba(22,163,74,0.35)] transition-all
                         hover:bg-[#15803D] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-[12px] text-[#9CA3AF] mt-6">
          {import.meta.env.VITE_ENV === 'development' && (
            <span className="bg-amber-100 text-amber-700 text-[11px] font-medium px-2 py-0.5 rounded-full">
              dev mode · {import.meta.env.VITE_API_URL}
            </span>
          )}
        </p>
      </div>
    </div>
  )
}
