
const Chat = require('../models/Chat')
const Team = require('../models/Team')

// Get team chat history
const getMessages = async (req, res) => {
  try {
    const { teamId } = req.params

    const isMember = await Team.exists({
      _id: teamId,
      'members.user': req.user.id
    })

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Only team members can access this chat.'
      })
    }

    const messages = await Chat.find({ team: teamId })
      .populate('sender', 'fullName')
      .sort({ createdAt: 1 })
      .limit(200)

    res.status(200).json({
      success: true,
      messages
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = { getMessages }
