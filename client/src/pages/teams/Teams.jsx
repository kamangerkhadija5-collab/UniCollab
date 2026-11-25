
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Upload,
  FileText,
  Download,
  Loader2
} from 'lucide-react'
import api from '../../services/api'

function Teams() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Team join request
  const [requestingId, setRequestingId] = useState(null)

  // File sharing
  const [teamFiles, setTeamFiles] = useState({})
  const [selectedFiles, setSelectedFiles] = useState({})
  const [uploading, setUploading] = useState({})
  const [fileErrors, setFileErrors] = useState({})

  const token = localStorage.getItem('token')

  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  // Fetch all teams
  const fetchTeams = async () => {
    try {
      const response = await api.get('/teams', config)
      setTeams(response.data.teams || [])
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load teams.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeams()
  }, [])

  // Fetch shared files for teams where user is a member
  useEffect(() => {
    if (!teams.length) {
      setTeamFiles({})
      return
    }

    let cancelled = false

    const fetchTeamFiles = async () => {
      const results = await Promise.allSettled(
        teams.map(team =>
          api.get(`/files/${team._id}`, config)
        )
      )

      if (cancelled) return

      const filesMap = {}

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          filesMap[teams[index]._id] =
            result.value.data.files || []
        }
      })

      setTeamFiles(filesMap)
    }

    fetchTeamFiles()

    return () => {
      cancelled = true
    }
  }, [teams])

  // Send join request
  const handleJoinTeam = async (teamId) => {
    try {
      setRequestingId(teamId)

      const response = await api.post(
        `/teams/${teamId}/join`,
        {},
        config
      )

      alert(response.data.message || 'Join request sent!')

      await fetchTeams()
    } catch (err) {
      alert(
        err.response?.data?.message ||
        'Failed to send join request.'
      )
    } finally {
      setRequestingId(null)
    }
  }

  // Select a file
  const handleFileChange = (teamId, file) => {
    setSelectedFiles(prev => ({
      ...prev,
      [teamId]: file || null
    }))

    setFileErrors(prev => ({
      ...prev,
      [teamId]: ''
    }))
  }

  // Upload file
  const handleUpload = async (e, teamId) => {
    e.preventDefault()

    const form = e.currentTarget
    const file = selectedFiles[teamId]

    if (!file) {
      setFileErrors(prev => ({
        ...prev,
        [teamId]: 'Please select a file first.'
      }))
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setUploading(prev => ({
      ...prev,
      [teamId]: true
    }))

    setFileErrors(prev => ({
      ...prev,
      [teamId]: ''
    }))

    try {
      const response = await api.post(
        `/files/${teamId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setTeamFiles(prev => ({
        ...prev,
        [teamId]: [
          response.data.file,
          ...(prev[teamId] || [])
        ]
      }))

      setSelectedFiles(prev => ({
        ...prev,
        [teamId]: null
      }))

      form.reset()

      alert('File uploaded successfully!')
    } catch (err) {
      setFileErrors(prev => ({
        ...prev,
        [teamId]:
          err.response?.data?.message ||
          'File upload failed.'
      }))
    } finally {
      setUploading(prev => ({
        ...prev,
        [teamId]: false
      }))
    }
  }

  // Convert bytes into readable size
  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading teams...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Explore Teams
          </h1>

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

      {/* Teams List */}
      {teams.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border">
          <h2 className="text-xl font-semibold">
            No teams available
          </h2>

          <p className="text-gray-500 mt-2">
            Be the first to create a team!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map(team => {
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
                    <strong>Leader:</strong>{' '}
                    {team.leader?.fullName || 'Unknown'}
                  </p>

                  <p className="text-sm mb-4 text-gray-700">
                    <strong>Members:</strong>{' '}
                    {team.members?.length || 1}
                  </p>

                  {/* Required Skills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {team.requiredSkills?.map((skill, index) => (
                      <span
                        key={`${team._id}-${skill}-${index}`}
                        className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Team Membership Status */}
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
                      {requestingId === team._id
                        ? 'Sending...'
                        : 'Request to Join'}
                    </button>
                  )}

                  {/* Shared Files - Only for verified team members */}
                  {Object.prototype.hasOwnProperty.call(
                    teamFiles,
                    team._id
                  ) && (
                    <div className="mt-6 pt-5 border-t">
                      <h3 className="font-semibold flex items-center gap-2 mb-3">
                        <FileText size={18} />
                        Shared Files
                      </h3>

                      {/* Upload Form */}
                      <form
                        onSubmit={e => handleUpload(e, team._id)}
                        className="space-y-3"
                      >
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.webp"
                          onChange={e =>
                            handleFileChange(
                              team._id,
                              e.target.files[0]
                            )
                          }
                          className="w-full text-sm border rounded-lg p-2"
                        />

                        <button
                          type="submit"
                          disabled={
                            uploading[team._id] ||
                            !selectedFiles[team._id]
                          }
                          className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                        >
                          {uploading[team._id] ? (
                            <>
                              <Loader2
                                size={17}
                                className="animate-spin"
                              />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload size={17} />
                              Upload File
                            </>
                          )}
                        </button>
                      </form>

                      {/* Upload Error */}
                      {fileErrors[team._id] && (
                        <p className="text-red-500 text-sm mt-2">
                          {fileErrors[team._id]}
                        </p>
                      )}

                      {/* Shared File List */}
                      <div className="mt-4 space-y-3">
                        {(teamFiles[team._id] || []).length === 0 ? (
                          <p className="text-sm text-gray-500">
                            No files shared yet.
                          </p>
                        ) : (
                          teamFiles[team._id].map(file => (
                            <div
                              key={file._id}
                              className="flex items-center justify-between gap-2 bg-gray-50 p-3 rounded-lg"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {file.originalName}
                                </p>

                                <p className="text-xs text-gray-500">
                                  {formatSize(file.size)}
                                  {' · '}
                                  {file.uploadedBy?.fullName || 'Student'}
                                </p>
                              </div>

                              <a
                                href={file.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 shrink-0"
                                title="Open file"
                              >
                                <Download size={19} />
                              </a>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
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




