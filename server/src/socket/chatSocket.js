
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const Chat = require('../models/Chat')
const Team = require('../models/Team')

const registerChatHandlers = (io) => {

  // Authenticate Socket.IO connections
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token

      if (!token) {
        return next(new Error('Authentication required'))
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      socket.userId = decoded.id || decoded._id

      if (!socket.userId) {
        return next(new Error('Invalid user token'))
      }

      next()
    } catch (error) {
      next(new Error('Invalid or expired token'))
    }
  })

  io.on('connection', (socket) => {
    console.log('User connected:', socket.userId)

    // Join team chat room
    socket.on('joinTeam', async (teamId) => {
      try {
        if (!mongoose.isValidObjectId(teamId)) {
          return socket.emit('chatError', 'Invalid team ID')
        }

        const isMember = await Team.exists({
          _id: teamId,
          'members.user': socket.userId
        })

        if (!isMember) {
          return socket.emit('chatError', 'You are not a team member')
        }

        socket.join(`team:${teamId}`)
        socket.emit('joinedTeam', teamId)

      } catch (error) {
        socket.emit('chatError', 'Unable to join team chat')
      }
    })

    // Send a message
    socket.on('sendMessage', async (data) => {
      try {
        const { teamId, message } = data || {}
        const text = typeof message === 'string' ? message.trim() : ''

        if (
          !mongoose.isValidObjectId(teamId) ||
          !text ||
          text.length > 2000
        ) {
          return socket.emit('chatError', 'Invalid message')
        }

        const room = `team:${teamId}`

        if (!socket.rooms.has(room)) {
          return socket.emit('chatError', 'Join the team chat first')
        }

        const isMember = await Team.exists({
          _id: teamId,
          'members.user': socket.userId
        })

        if (!isMember) {
          return socket.emit('chatError', 'You are not a team member')
        }

        const chat = await Chat.create({
          team: teamId,
          sender: socket.userId,
          message: text
        })

        const populatedMessage = await Chat.findById(chat._id)
          .populate('sender', 'fullName')

        io.to(room).emit('newMessage', populatedMessage)

      } catch (error) {
        socket.emit('chatError', 'Failed to send message')
      }
    })

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId)
    })
  })
}

module.exports = registerChatHandlers
