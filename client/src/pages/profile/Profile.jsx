import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, CheckCircle2, AlertCircle, Save } from 'lucide-react'
import api from '../../services/api'
import AppLayout from '../../components/layout/AppLayout'

const skillOptions = [
  'Python',
  'JavaScript',
  'React',
  'Node.js',
  'MongoDB',
  'SQL',
  'Machine Learning',
  'Deep Learning',
  'UI/UX',
  'HTML/CSS',
  'C++',
  'Java'
]

const interestOptions = [
  'Artificial Intelligence',
  'Web Development',
  'Data Science',
  'Cybersecurity',
  'Cloud Computing',
  'Mobile Development'
]

function Profile() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    department: '',
    semester: '',
    bio: '',
   skills: [],
interests: [],
    github: '',
    linkedin: ''
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        const user = response.data.user

        setForm({
          fullName: user.fullName || '',
          email: user.email || '',
          department: user.department || '',
          semester: user.semester || '',
          bio: user.bio || '',
          skills: user.skills || [],
          interests: user.interests || [],
          github: user.github || '',
          linkedin: user.linkedin || ''
        })
      } catch (err) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [navigate])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const toggleTag = (field, value) => {
  setForm(prev => ({
    ...prev,
    [field]: prev[field].includes(value)
      ? prev[field].filter(item => item !== value)
      : [...prev[field], value]
  }))
}

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setSaving(true)

    try {
      const response = await api.put(
        '/auth/profile',
        {
          fullName: form.fullName,
          department: form.department,
          semester: form.semester ? Number(form.semester) : undefined,
          bio: form.bio,
          skills: form.skills,
          interests: form.interests,
          github: form.github,
          linkedin: form.linkedin
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      localStorage.setItem('user', JSON.stringify(response.data.user))
      setMessage('Profile updated successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AppLayout title="My Profile">
        <div className="flex items-center justify-center gap-3 py-24 text-slate-500">
          <Loader2 size={22} className="animate-spin text-blue-600" />
          Loading profile...
        </div>
      </AppLayout>
    )
  }

  const fields = [
    { name: 'fullName', label: 'Full Name', type: 'text' },
    { name: 'email', label: 'Email Address', type: 'email', disabled: true },
    { name: 'department', label: 'Department', type: 'text' },
    { name: 'semester', label: 'Semester', type: 'number' },
    { name: 'github', label: 'GitHub URL', type: 'url' },
    { name: 'linkedin', label: 'LinkedIn URL', type: 'url' }
  ]

  const labelClass = 'mb-2 block text-sm font-semibold text-slate-700'
  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500'
  const cardClass = 'rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 sm:p-8'

  return (
    <AppLayout title="My Profile">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#0B1B3F]">
            My Profile
          </h1>
          <p className="mt-2 text-slate-500">
            Manage your personal information and skills.
          </p>
        </div>

        {/* Identity summary */}
        <div className="mb-6 flex items-center gap-5 rounded-2xl bg-gradient-to-br from-blue-100 via-blue-50 to-white p-6 shadow-sm ring-1 ring-blue-100 sm:p-8">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-bold text-white shadow-lg shadow-blue-600/25 sm:h-20 sm:w-20 sm:text-3xl">
            {(form.fullName || 'S').charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="truncate text-xl font-bold text-[#0B1B3F] sm:text-2xl">
              {form.fullName || 'Your name'}
            </p>
            <p className="mt-1 truncate text-sm text-slate-500">{form.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal information */}
          <div className={cardClass}>
            <h2 className="text-lg font-bold text-[#0B1B3F]">Personal information</h2>
            <p className="mb-6 mt-1 text-sm text-slate-500">
              Your basic details and links.
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              {fields.map((field) => (
                <div key={field.name}>
                  <label htmlFor={field.name} className={labelClass}>
                    {field.label}
                  </label>

                  <input
                    id={field.name}
                    type={field.type}
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    disabled={field.disabled}
                    min={field.name === 'semester' ? 1 : undefined}
                    max={field.name === 'semester' ? 12 : undefined}
                    placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Skills Selection */}
          <div className={cardClass}>
            <h2 className="text-lg font-bold text-[#0B1B3F]">Select Your Skills</h2>
            <p className="mb-5 mt-1 text-sm text-slate-500">
              Pick the skills teammates should know you have.
            </p>

            <div className="flex flex-wrap gap-2.5">
              {skillOptions.map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleTag('skills', item)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    form.skills.includes(item)
                      ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/25'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Interests Selection */}
          <div className={cardClass}>
            <h2 className="text-lg font-bold text-[#0B1B3F]">Select Your Interests</h2>
            <p className="mb-5 mt-1 text-sm text-slate-500">
              Topics you'd love to work on.
            </p>

            <div className="flex flex-wrap gap-2.5">
              {interestOptions.map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleTag('interests', item)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                    form.interests.includes(item)
                      ? 'border-violet-600 bg-violet-600 text-white shadow-md shadow-violet-600/25'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className={cardClass}>
            <label htmlFor="bio" className="block text-lg font-bold text-[#0B1B3F]">
              Bio
            </label>
            <p className="mb-4 mt-1 text-sm text-slate-500">
              A short introduction other students will see.
            </p>

            <textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us something about yourself..."
              className={`${inputClass} resize-none`}
            />
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div
              role="status"
              className="flex items-start gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
            >
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Profile
              </>
            )}
          </button>
        </form>
      </div>
    </AppLayout>
  )
}

export default Profile
