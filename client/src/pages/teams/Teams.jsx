import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

function Teams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [requestingId, setRequestingId] = useState(null)

  const fetchTeams = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await api.get('/teams', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setTeams(response.data.teams || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load teams.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  const handleJoinTeam = async (teamId) => {
    try {
      setRequestingId(teamId)
      const token = localStorage.getItem('token')

      const response = await api.post(
        `/teams/${teamId}/join`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      alert(response.data.message || 'Join request sent!')
      fetchTeams()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send join request')
    } finally {
      setRequestingId(null)
    }
  }

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading teams...</div>
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
          className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 font-medium transition"
        >
          + Create Team
        </Link>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border">
          <h2 className="text-xl font-semibold">No teams available</h2>
          <p className="text-gray-500 mt-2">
            Be the first to create a team!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => {
            const isLeader = team.isLeader
            const isMember = team.isMember
            const hasPending = team.hasPendingRequest

            return (
              <div
                key={team._id}
                className="border rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between bg-white"
              >
                <div>
                  <h2 className="text-xl font-bold mb-2 text-gray-800">
                    {team.name}
                  </h2>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {team.description || 'No description provided.'}
                  </p>

                  <p className="text-sm mb-2 text-gray-700">
                    <strong>Leader:</strong> {team.leader?.fullName || 'Unknown'}
                  </p>

                  <p className="text-sm mb-4 text-gray-700">
                    <strong>Members:</strong> {team.members?.length || 1}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {team.requiredSkills?.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  {isLeader ? (
                    <button
                      disabled
                      className="w-full bg-gray-100 text-gray-600 py-2.5 rounded-lg font-medium cursor-default"
                    >
                      Team Leader
                    </button>
                  ) : isMember ? (
                    <button
                      disabled
                      className="w-full bg-green-50 text-green-700 border border-green-200 py-2.5 rounded-lg font-medium cursor-default"
                    >
                      Joined
                    </button>
                  ) : hasPending ? (
                    <button
                      disabled
                      className="w-full bg-yellow-50 text-yellow-700 border border-yellow-200 py-2.5 rounded-lg font-medium cursor-default"
                    >
                      Request Pending
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinTeam(team._id)}
                      disabled={requestingId === team._id}
                      className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium transition disabled:opacity-50"
                    >
                      {requestingId === team._id ? 'Sending...' : 'Request to Join'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Teams