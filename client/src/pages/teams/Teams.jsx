
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

function Teams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem('token')

        const response = await api.get('/teams', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        setTeams(response.data.teams)
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to load teams.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])


const handleJoinTeam = async (teamId) => {
  try {
    const token = localStorage.getItem('token')

    const response = await api.post(
      `/teams/${teamId}/join`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    alert(response.data.message)
  } catch (err) {
    alert(err.response?.data?.message || 'Failed to send join request')
  }
}


  if (loading) {
    return <div className="p-8 text-center">Loading teams...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Explore Teams</h1>
          <p className="text-gray-500 mt-2">
            Discover teams and find collaboration opportunities.
          </p>
        </div>

        <Link
          to="/teams/create"
          className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
        >
          + Create Team
        </Link>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <h2 className="text-xl font-semibold">No teams available</h2>
          <p className="text-gray-500 mt-2">
            Be the first to create a team!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {teams.map(team => (
            <div
              key={team._id}
              className="border rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-xl font-bold mb-2">
                {team.name}
              </h2>

              <p className="text-gray-600 text-sm mb-4">
                {team.description || 'No description provided.'}
              </p>

              <p className="text-sm mb-2">
                <strong>Leader:</strong>{' '}
                {team.leader?.fullName || 'Unknown'}
              </p>

              <p className="text-sm mb-4">
                <strong>Members:</strong> {team.members.length}
              </p>

              <div className="flex flex-wrap gap-2">
                {team.requiredSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <button
                    onClick={() => handleJoinTeam(team._id)}
                    className="mt-5 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                    >
                    Request to Join
                    </button>
            </div>
          ))}

        </div>
      )}
    </div>
  )
}

export default Teams
