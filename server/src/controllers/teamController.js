
const Team = require('../models/Team')

const createTeam = async (req, res) => {
  try {
    const { name, description, requiredSkills } = req.body

    // Check required field
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Team name is required'
      })
    }

    // Create team
    const team = await Team.create({
      name: name.trim(),
      description,
      requiredSkills: requiredSkills || [],

      // Logged-in student becomes leader
      leader: req.user.id,

      // Add leader as first member
      members: [
        {
          user: req.user.id,
          role: 'leader'
        }
      ]
    })

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      team
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


const getTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('leader', 'fullName department semester')
      .populate('members.user', 'fullName department')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: teams.length,
      teams
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
const requestToJoinTeam = async (req, res) => {
  try {
    const { id } = req.params

    const team = await Team.findById(id)

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    const alreadyMember = team.members.some(
      member => member.user.toString() === req.user.id
    )

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this team'
      })
    }

    const existingRequest = team.joinRequests.find(
      request =>
        request.user.toString() === req.user.id &&
        request.status === 'pending'
    )

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending request'
      })
    }

    team.joinRequests.push({
      user: req.user.id,
      message: req.body.message || ''
    })

    await team.save()

    res.status(201).json({
      success: true,
      message: 'Join request sent successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const getJoinRequests = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('joinRequests.user', 'fullName email department')

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    if (team.leader.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the team leader can view join requests'
      })
    }

    res.status(200).json({
      success: true,
      requests: team.joinRequests.filter(
        request => request.status === 'pending'
      )
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const handleJoinRequest = async (req, res) => {
  try {
    const { id, requestId } = req.params
    const { action } = req.body

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action'
      })
    }

    const team = await Team.findById(id)

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    if (team.leader.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only the team leader can manage requests'
      })
    }

    const request = team.joinRequests.id(requestId)

    if (!request || request.status !== 'pending') {
      return res.status(404).json({
        success: false,
        message: 'Pending request not found'
      })
    }

    if (action === 'accept') {
      team.members.push({
        user: request.user,
        role: 'member'
      })
      request.status = 'accepted'
    } else {
      request.status = 'rejected'
    }

    await team.save()

    res.status(200).json({
      success: true,
      message: `Request ${action}ed successfully`
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const getMyTeams = async (req, res) => {
  try {
    const teams = await Team.find({ leader: req.user.id })
      .select('name description')

    res.status(200).json({
      success: true,
      teams
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  createTeam,
  getTeams,
  requestToJoinTeam,
  getJoinRequests,
  handleJoinRequest,
  getMyTeams
}

