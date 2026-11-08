import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import api from '../../services/api'

function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/auth/signup', {
        fullName,
        email,
        password
      })

      setSuccess(response.data.message)

      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (error) {
      setError(
        error.response?.data?.message || 'Signup failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition'
  const labelClass = 'block text-sm font-semibold text-slate-700 mb-2'
  const iconClass = 'absolute left-4 top-1/2 -translate-y-1/2 text-slate-400'
  const eyeClass =
    'absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition'

  // Simple password strength (0-3)
  const strength =
    (password.length >= 6 ? 1 : 0) +
    (password.length >= 10 ? 1 : 0) +
    (/[A-Z]/.test(password) && /\d/.test(password) ? 1 : 0)
  const strengthLabel = ['Too short', 'Weak', 'Good', 'Strong'][strength]
  const strengthColor = ['bg-slate-200', 'bg-red-400', 'bg-amber-400', 'bg-emerald-500'][strength]

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join UniCollab and start collaborating."
      footer={
        <>
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Login
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full name */}
        <div>
          <label htmlFor="fullName" className={labelClass}>Full name</label>
          <div className="relative">
            <User size={18} className={iconClass} />
            <input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className={labelClass}>Email address</label>
          <div className="relative">
            <Mail size={18} className={iconClass} />
            <input
              id="email"
              type="email"
              placeholder="you@university.edu"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <div className="relative">
            <Lock size={18} className={iconClass} />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={eyeClass}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          {/* Strength meter */}
          {password && (
            <div className="mt-2">
              <div className="flex gap-1.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      i <= strength ? strengthColor : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-slate-500">{strengthLabel}</p>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label htmlFor="confirmPassword" className={labelClass}>Confirm password</label>
          <div className="relative">
            <Lock size={18} className={iconClass} />
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm your password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className={eyeClass}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          {passwordsMatch && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-600">
              <CheckCircle2 size={14} /> Passwords match
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div
            role="status"
            className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-600/25 transition"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </button>
      </form>
    </AuthLayout>
  )
}

export default Signup




// import { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import AuthLayout from '../../components/auth/AuthLayout'
// import api from '../../services/api'

// function Signup() {
//   const [fullName, setFullName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const [loading, setLoading] = useState(false)

//   const navigate = useNavigate()

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')
//     setSuccess('')

//     if (password !== confirmPassword) {
//       setError('Passwords do not match.')
//       return
//     }

//     if (password.length < 6) {
//       setError('Password must be at least 6 characters.')
//       return
//     }

//     setLoading(true)

//     try {
//       const response = await api.post('/auth/signup', {
//         fullName,
//         email,
//         password
//       })

//       setSuccess(response.data.message)

//       setTimeout(() => {
//         navigate('/login')
//       }, 1500)

//     } catch (error) {
//       setError(
//         error.response?.data?.message || 'Signup failed. Please try again.'
//       )
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <AuthLayout
//       title="Create Account"
//       subtitle="Join UniCollab and start collaborating."
//       footer={
//         <>
//           Already have an account?{' '}
//           <Link
//             to="/login"
//             className="text-blue-600 font-semibold hover:underline"
//           >
//             Login
//           </Link>
//         </>
//       }
//     >
//       <form onSubmit={handleSubmit} className="space-y-4">

//         <div>
//           <label className="block text-sm font-medium mb-2">
//             Full Name
//           </label>
//           <input
//             type="text"
//             placeholder="Enter your full name"
//             value={fullName}
//             onChange={(e) => setFullName(e.target.value)}
//             required
//             className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-2">
//             Email Address
//           </label>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-2">
//             Password
//           </label>
//           <input
//             type="password"
//             placeholder="Create a password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-2">
//             Confirm Password
//           </label>
//           <input
//             type="password"
//             placeholder="Confirm your password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//             className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {error && (
//           <p className="text-sm text-red-600">{error}</p>
//         )}

//         {success && (
//           <p className="text-sm text-green-600">{success}</p>
//         )}

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition"
//         >
//           {loading ? 'Creating Account...' : 'Create Account'}
//         </button>

//       </form>
//     </AuthLayout>
//   )
// }

// export default Signup
