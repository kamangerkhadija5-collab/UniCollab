
const express = require('express')
const router = express.Router()

const {
  createTeam,
  getTeams,
  requestToJoinTeam,
  getJoinRequests,
  handleJoinRequest,
  getMyTeams
} = require('../controllers/teamController')

const protect = require('../middleware/authMiddleware')


// Create a new team (login required)
router.post('/', protect, createTeam)
router.get('/my', protect, getMyTeams)


router.post('/:id/join', protect, requestToJoinTeam)
router.get('/:id/requests', protect, getJoinRequests)
router.put('/:id/requests/:requestId', protect, handleJoinRequest)


// Get all teams
router.get('/', protect, getTeams)

module.exports = router
