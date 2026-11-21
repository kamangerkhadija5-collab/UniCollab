
import { useEffect, useState } from 'react'
import api from '../../services/api'

function Projects() {
  const [projects, setProjects] = useState([])
  const [teams, setTeams] = useState([])
  const [form, setForm] = useState({
    name: '',
    description: '',
    team: '',
    deadline: ''
  })
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('token')
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }

  const fetchData = async () => {
    try {
      const [projectRes, teamRes] = await Promise.all([
        api.get('/projects', config),
        api.get('/teams', config)
      ])

      setProjects(projectRes.data.projects)
      setTeams(teamRes.data.teams)
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await api.post('/projects', form, config)
      alert(response.data.message)

      setForm({
        name: '',
        description: '',
        team: '',
        deadline: ''
      })

      fetchData()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create project')
    }
  }

  if (loading) return <p className="p-8">Loading projects...</p>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>

      <form
        onSubmit={handleSubmit}
        className="border rounded-xl p-6 mb-8 space-y-4"
      >
        <h2 className="text-xl font-semibold">Create New Project</h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Project name"
          required
          className="w-full border rounded-lg p-3"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Project description"
          className="w-full border rounded-lg p-3"
        />

        <select
          name="team"
          value={form.team}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        >
          <option value="">Select a team</option>
          {teams.map(team => (
            <option key={team._id} value={team._id}>
              {team.name}
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium">
          Deadline
        </label>

        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="w-full border rounded-lg p-3"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Create Project
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4">
        All My Team Projects
      </h2>

      {projects.length === 0 ? (
        <p className="text-gray-500">No projects available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map(project => (
            <div key={project._id} className="border rounded-xl p-5">

              <h3 className="text-xl font-bold">
                {project.name}
              </h3>

              <p className="text-gray-600 my-3">
                {project.description || 'No description'}
              </p>

              <p><strong>Team:</strong> {project.team?.name}</p>
              <p><strong>Created by:</strong> {project.createdBy?.fullName}</p>
              <p><strong>Status:</strong> {project.status}</p>

              <p className="mt-2">
                <strong>Deadline:</strong>{' '}
                {project.deadline
                  ? new Date(project.deadline).toLocaleDateString()
                  : 'Not set'}
              </p>

              {/* Project Progress */}
              <div className="mt-5">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">
                    Project Progress
                  </span>

                  <span className="font-bold text-blue-600">
                    {project.progress || 0}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${project.progress || 0}%`
                    }}
                  />
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  {project.completedTasks || 0} of {project.totalTasks || 0} tasks completed
                </p>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Projects
