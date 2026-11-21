
import { useEffect, useState } from 'react'
import api from '../../services/api'

function TeamRequests() {
  const [teams, setTeams] = useState([])
  const [requests, setRequests] = useState({})
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem('token')
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }

  const fetchData = async () => {
    try {
      const response = await api.get('/teams/my', config)
      const myTeams = response.data.teams
      setTeams(myTeams)

      const results = await Promise.all(
        myTeams.map(team =>
          api.get(`/teams/${team._id}/requests`, config)
        )
      )

      const requestData = {}
      myTeams.forEach((team, index) => {
        requestData[team._id] = results[index].data.requests
      })

      setRequests(requestData)
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to load requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAction = async (teamId, requestId, action) => {
    try {
      await api.put(
        `/teams/${teamId}/requests/${requestId}`,
        { action },
        config
      )
      alert(`Request ${action}ed successfully`)
      fetchData()
    } catch (error) {
      alert(error.response?.data?.message || 'Action failed')
    }
  }

  if (loading) return <p className="p-8">Loading...</p>

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Teams & Requests</h1>

      {teams.length === 0 ? (
        <p>You have not created any teams yet.</p>
      ) : (
        teams.map(team => (
          <div key={team._id} className="border rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold">{team.name}</h2>
            <p className="text-gray-500 mb-4">{team.description}</p>

            <h3 className="font-semibold mb-3">Pending Join Requests</h3>

            {!requests[team._id]?.length ? (
              <p className="text-gray-500">No pending requests.</p>
            ) : (
              requests[team._id].map(request => (
                <div
                  key={request._id}
                  className="flex flex-wrap justify-between items-center gap-3 border-t py-4"
                >
                  <div>
                    <p className="font-medium">
                      {request.user?.fullName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {request.user?.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      {request.message}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleAction(team._id, request._id, 'accept')
                      }
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() =>
                        handleAction(team._id, request._id, 'reject')
                      }
                      className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default TeamRequests
