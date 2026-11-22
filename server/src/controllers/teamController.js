const Team = require('../models/Team')

const createTeam = async (req, res) => {
  try {
    const { name, description, requiredSkills } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Team name is required'
      })
    }

    const team = await Team.create({
      name: name.trim(),
      description: description ? description.trim() : '',
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      leader: req.user.id,
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

    // Enhance team list with member & request status for the logged-in user
    const formattedTeams = teams.map((team) => {
      const teamObj = team.toObject()
      const userId = req.user?.id || req.user?._id

      teamObj.isLeader = team.leader?._id?.toString() === userId?.toString()
      teamObj.isMember = team.members.some(
        (m) => m.user?._id?.toString() === userId?.toString()
      )
      teamObj.hasPendingRequest = team.joinRequests.some(
        (r) => r.user?.toString() === userId?.toString() && r.status === 'pending'
      )

      return teamObj
    })

    res.status(200).json({
      success: true,
      count: formattedTeams.length,
      teams: formattedTeams
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
    const userId = req.user.id || req.user._id

    const team = await Team.findById(id)

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    const alreadyMember = team.members.some(
      (member) => member.user.toString() === userId.toString()
    )

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this team'
      })
    }

    const existingRequest = team.joinRequests.find(
      (request) =>
        request.user.toString() === userId.toString() &&
        request.status === 'pending'
    )

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending request for this team'
      })
    }

    team.joinRequests.push({
      user: userId,
      message: req.body.message || 'Requesting to join the team.'
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
    const userId = req.user.id || req.user._id
    const team = await Team.findById(req.params.id).populate(
      'joinRequests.user',
      'fullName email department semester'
    )

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    if (team.leader.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the team leader can view join requests'
      })
    }

    res.status(200).json({
      success: true,
      requests: team.joinRequests.filter(
        (request) => request.status === 'pending'
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
    const userId = req.user.id || req.user._id

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Action must be accept or reject.'
      })
    }

    const team = await Team.findById(id)

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    if (team.leader.toString() !== userId.toString()) {
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
    const userId = req.user.id || req.user._id
    const teams = await Team.find({
      $or: [{ leader: userId }, { 'members.user': userId }]
    })
      .select('name description leader members requiredSkills')
      .populate('leader', 'fullName')

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