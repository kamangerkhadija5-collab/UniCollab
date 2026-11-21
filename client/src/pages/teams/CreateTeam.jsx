
import { useState } from 'react'
import api from '../../services/api'

function CreateTeam() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    requiredSkills: []
  })

  const [skillInput, setSkillInput] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const addSkill = () => {
    const skill = skillInput.trim()

    if (skill && !form.requiredSkills.includes(skill)) {
      setForm({
        ...form,
        requiredSkills: [...form.requiredSkills, skill]
      })
      setSkillInput('')
    }
  }

  const removeSkill = (skill) => {
    setForm({
      ...form,
      requiredSkills: form.requiredSkills.filter(
        item => item !== skill
      )
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    try {
      setLoading(true)

      const token = localStorage.getItem('token')

      const response = await api.post('/teams', form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setMessage('Team created successfully!')

      setForm({
        name: '',
        description: '',
        requiredSkills: []
      })

    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Failed to create team.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">
        Create a Team
      </h1>

      <p className="text-gray-500 mb-6">
        Create your team and find students with suitable skills.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block font-medium mb-2">
            Team Name
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter team name"
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your team..."
            rows="4"
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">
            Required Skills
          </label>

          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addSkill()
                }
              }}
              placeholder="e.g. Python"
              className="flex-1 border rounded-lg p-3"
            />

            <button
              type="button"
              onClick={addSkill}
              className="bg-blue-600 text-white px-5 rounded-lg"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {form.requiredSkills.map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => removeSkill(skill)}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
              >
                {skill} ×
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Team'}
        </button>

        {message && (
          <p className="text-center font-medium">
            {message}
          </p>
        )}

      </form>
    </div>
  )
}

export default CreateTeam
