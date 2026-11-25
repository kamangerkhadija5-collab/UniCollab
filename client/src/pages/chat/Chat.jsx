
import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import api from '../../services/api'

function Chat() {
  const [teams, setTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState('')
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)

  const socketRef = useRef(null)
  const selectedTeamRef = useRef('')

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }

  // Load teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await api.get('/teams', config)
        setTeams(response.data.teams)
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to load teams')
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])

  // Socket connection
  useEffect(() => {
    const socket = io('http://localhost:5000', {
      auth: {
        token: localStorage.getItem('token')
      }
    })

    socketRef.current = socket

    socket.on('connect', () => {
      setConnected(true)

      if (selectedTeamRef.current) {
        socket.emit('joinTeam', selectedTeamRef.current)
      }
    })

    socket.on('disconnect', () => {
      setConnected(false)
    })

    socket.on('newMessage', (newMessage) => {
      if (
        newMessage.team === selectedTeamRef.current ||
        newMessage.team?._id === selectedTeamRef.current
      ) {
        setMessages(prev => {
          if (prev.some(msg => msg._id === newMessage._id)) {
            return prev
          }

          return [...prev, newMessage]
        })
      }
    })

    socket.on('chatError', (error) => {
      alert(error)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  // Select team and load chat history
  useEffect(() => {
    selectedTeamRef.current = selectedTeam
    setMessages([])

    if (!selectedTeam) return

    if (socketRef.current?.connected) {
      socketRef.current.emit('joinTeam', selectedTeam)
    }

    const fetchMessages = async () => {
      try {
        const response = await api.get(`/chat/${selectedTeam}`, config)
        setMessages(response.data.messages)
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to load messages')
      }
    }

    fetchMessages()
  }, [selectedTeam])

  const sendMessage = (e) => {
    e.preventDefault()

    const text = message.trim()

    if (!text || !selectedTeam || !socketRef.current?.connected) {
      return
    }

    socketRef.current.emit('sendMessage', {
      teamId: selectedTeam,
      message: text
    })

    setMessage('')
  }

  if (loading) {
    return <p className="p-8">Loading teams...</p>
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Team Chat</h1>

      <div className="border rounded-xl overflow-hidden bg-white">

        {/* Team Selector */}
        <div className="p-4 border-b">
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option value="">Select a team</option>

            {teams.map(team => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>

          <p className="text-sm mt-2">
            <span className={connected ? 'text-green-600' : 'text-red-500'}>
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </p>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
          {!selectedTeam ? (
            <p className="text-center text-gray-500 mt-20">
              Select a team to open chat.
            </p>
          ) : messages.length === 0 ? (
            <p className="text-center text-gray-500 mt-20">
              No messages yet. Start the conversation!
            </p>
          ) : (
            messages.map(msg => (
              <div
                key={msg._id}
                className="mb-4 bg-white border rounded-lg p-3 shadow-sm"
              >
                <p className="font-semibold text-blue-600">
                  {msg.sender?.fullName || 'Student'}
                </p>

                <p className="break-words">{msg.message}</p>

                <p className="text-xs text-gray-400 mt-2">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleString()
                    : ''}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} className="p-4 border-t flex gap-3">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            maxLength={2000}
            disabled={!selectedTeam || !connected}
            className="flex-1 border rounded-lg p-3"
          />

          <button
            type="submit"
            disabled={!selectedTeam || !connected || !message.trim()}
            className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </form>

      </div>
    </div>
  )
}

export default Chat
