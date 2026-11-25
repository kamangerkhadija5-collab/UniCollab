const dns = require('node:dns')
dns.setServers(['1.1.1.1'])

require('dotenv').config()

const http = require('http')
const express = require('express')
const cors = require('cors')
const { Server } = require('socket.io')

const connectDB = require('./config/db')

// Routes
const authRoutes = require('./routes/authRoutes')
const studentRoutes = require('./routes/studentRoutes')
const projectRoutes = require('./routes/projectRoutes')
const teamRoutes = require('./routes/teamRoutes')
const taskRoutes = require('./routes/taskRoutes')
const chatRoutes = require('./routes/chatRoutes')
const fileRoutes = require('./routes/fileRoutes')

// Socket.IO
const registerChatHandlers = require('./socket/chatSocket')

// Error Middleware
const {
  notFound,
  errorHandler
} = require('./middleware/errorMiddleware')

const app = express()
const server = http.createServer(app)

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

app.set('io', io)
registerChatHandlers(io)

// Middleware
app.use(cors())
app.use(express.json())

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/teams', teamRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/files', fileRoutes)

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'UniCollab Backend is running!'
  })
})

// Error Handling — Always keep these LAST
app.use(notFound)
app.use(errorHandler)

// Start Server
const startServer = async () => {
  try {
    await connectDB()

    const PORT = process.env.PORT || 5000

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log('Socket.IO is ready')
    })
  } catch (error) {
    console.error('Server startup failed:', error.message)
    process.exit(1)
  }
}

startServer()





// const dns = require('node:dns')
// dns.setServers(['8.8.8.8', '1.1.1.1'])

// require('dotenv').config()

// const http = require('http')
// const express = require('express')
// const cors = require('cors')
// const { Server } = require('socket.io')

// const connectDB = require('./config/db')

// const authRoutes = require('./routes/authRoutes')
// const studentRoutes = require('./routes/studentRoutes')
// const projectRoutes = require('./routes/projectRoutes')
// const teamRoutes = require('./routes/teamRoutes')
// const taskRoutes = require('./routes/taskRoutes')

// const app = express()
// const server = http.createServer(app)

// // Socket.IO setup
// const io = new Server(server, {
//   cors: {
//     origin: 'http://localhost:5173',
//     methods: ['GET', 'POST']
//   }
// })

// const chatRoutes = require('./routes/chatRoutes')
// const registerChatHandlers = require('./socket/chatSocket')

// const fileRoutes = require('./routes/fileRoutes')

// const { notFound, errorHandler } = require('./middleware/errorMiddleware')

// app.set('io', io)
// registerChatHandlers(io)

// app.set('io', io)

// // Middleware
// app.use(cors())
// app.use(express.json())
// // Error Handling
// app.use(notFound)
// app.use(errorHandler)

// // API Routes
// app.use('/api/auth', authRoutes)
// app.use('/api/students', studentRoutes)
// app.use('/api/projects', projectRoutes)
// app.use('/api/teams', teamRoutes)
// app.use('/api/tasks', taskRoutes)

// app.use('/api/chat', chatRoutes)

// app.use('/api/files', fileRoutes)

// // Health Check
// app.get('/api/health', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'UniCollab Backend is running!'
//   })
// })

// // Start server
// const startServer = async () => {
//   try {
//     await connectDB()

//     const PORT = process.env.PORT || 5000

//     server.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`)
//       console.log('Socket.IO is ready')
//     })
//   } catch (error) {
//     console.error('Server startup failed:', error.message)
//     process.exit(1)
//   }
// }

// startServer()










// // const dns = require('node:dns')
// // const teamRoutes = require('./routes/teamRoutes')
// // dns.setServers(['8.8.8.8', '1.1.1.1'])

// // require('dotenv').config()

// // require('dotenv').config()

// // const express = require('express')
// // const cors = require('cors')
// // const connectDB = require('./config/db')
// // const authRoutes = require('./routes/authRoutes')
// // const studentRoutes = require('./routes/studentRoutes')
// // const app = express()

// // const projectRoutes = require('./routes/projectRoutes')

// // const taskRoutes = require('./routes/taskRoutes')


// // // Middleware
// // app.use(cors())
// // app.use(express.json())

// // app.use('/api/auth', authRoutes)
// // app.use('/api/students', studentRoutes)
// // app.use('/api/projects', projectRoutes)
// // app.use('/api/teams', teamRoutes)
// // app.use('/api/tasks', taskRoutes)

// // // Test route
// // app.get('/api/health', (req, res) => {
// //   res.status(200).json({
// //     success: true,
// //     message: 'UniCollab Backend is running!'
// //   })
// // })

// // // Start server after database connection
// // const startServer = async () => {
// //   try {
// //     await connectDB()

// //     const PORT = process.env.PORT || 5000

// //     app.listen(PORT, () => {
// //       console.log(`Server running on port ${PORT}`)
// //     })
// //   } catch (error) {
// //     console.error('Server startup failed:', error.message)
// //     process.exit(1)
// //   }
// // }

// // startServer()
