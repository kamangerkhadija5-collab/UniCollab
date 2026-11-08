import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

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
    return <p className="p-10 text-center">Loading profile...</p>
  }

  const fields = [
    { name: 'fullName', label: 'Full Name', type: 'text' },
    { name: 'email', label: 'Email Address', type: 'email', disabled: true },
    { name: 'department', label: 'Department', type: 'text' },
    { name: 'semester', label: 'Semester', type: 'number' },
    { name: 'github', label: 'GitHub URL', type: 'url' },
    { name: 'linkedin', label: 'LinkedIn URL', type: 'url' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            My Profile
          </h1>
          <p className="text-gray-500 mt-2">
            Manage your personal information and skills.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-5"
        >
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {field.label}
              </label>

              <input
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                disabled={field.disabled}
                min={field.name === 'semester' ? 1 : undefined}
                max={field.name === 'semester' ? 12 : undefined}
                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
          ))}

          {/* Skills Selection */}
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-3">
    Select Your Skills
  </label>

  <div className="flex flex-wrap gap-2">
    {skillOptions.map(item => (
      <button
        key={item}
        type="button"
        onClick={() => toggleTag('skills', item)}
        className={`px-4 py-2 rounded-full text-sm border transition ${
          form.skills.includes(item)
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-500'
        }`}
      >
        {item}
      </button>
    ))}
  </div>
</div>

{/* Interests Selection */}
<div>
  <label className="block text-sm font-semibold text-gray-700 mb-3">
    Select Your Interests
  </label>

  <div className="flex flex-wrap gap-2">
    {interestOptions.map(item => (
      <button
        key={item}
        type="button"
        onClick={() => toggleTag('interests', item)}
        className={`px-4 py-2 rounded-full text-sm border transition ${
          form.interests.includes(item)
            ? 'bg-purple-600 text-white border-purple-600'
            : 'bg-white text-gray-700 border-gray-300 hover:border-purple-500'
        }`}
      >
        {item}
      </button>
    ))}
  </div>
</div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bio
            </label>

            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us something about yourself..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          {message && (
            <p className="text-green-600 text-sm">{message}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile