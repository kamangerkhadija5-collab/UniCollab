const dns = require('node:dns')
const teamRoutes = require('./routes/teamRoutes')
dns.setServers(['8.8.8.8', '1.1.1.1'])

require('dotenv').config()

require('dotenv').config()

const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const studentRoutes = require('./routes/studentRoutes')
const app = express()

const projectRoutes = require('./routes/projectRoutes')

const taskRoutes = require('./routes/taskRoutes')


// Middleware
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/teams', teamRoutes)
app.use('/api/tasks', taskRoutes)

// Test route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'UniCollab Backend is running!'
  })
})

// Start server after database connection
const startServer = async () => {
  try {
    await connectDB()

    const PORT = process.env.PORT || 5000

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Server startup failed:', error.message)
    process.exit(1)
  }
}

startServer()
