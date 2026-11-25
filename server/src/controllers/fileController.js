
const File = require('../models/File')
const Team = require('../models/Team')
const cloudinary = require('../config/cloudinary')
const mongoose = require('mongoose')

const isTeamMember = async (teamId, userId) => {
  return Team.exists({
    _id: teamId,
    'members.user': userId
  })
}

// Upload a file
const uploadFile = async (req, res) => {
  try {
    const { teamId } = req.params

    if (!mongoose.isValidObjectId(teamId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid team ID.'
      })
    }

    const member = await isTeamMember(teamId, req.user.id)

    if (!member) {
      return res.status(403).json({
        success: false,
        message: 'Only team members can upload files.'
      })
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a file.'
      })
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `UniCollab/teams/${teamId}`,
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )

      stream.end(req.file.buffer)
    })

    const savedFile = await File.create({
      team: teamId,
      uploadedBy: req.user.id,
      originalName: req.file.originalname,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      mimeType: req.file.mimetype,
      size: req.file.size
    })

    const populatedFile = await File.findById(savedFile._id)
      .populate('uploadedBy', 'fullName')

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully.',
      file: populatedFile
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'File upload failed.'
    })
  }
}

// Get files of a team
const getTeamFiles = async (req, res) => {
  try {
    const { teamId } = req.params

    if (!mongoose.isValidObjectId(teamId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid team ID.'
      })
    }

    const member = await isTeamMember(teamId, req.user.id)

    if (!member) {
      return res.status(403).json({
        success: false,
        message: 'Only team members can access these files.'
      })
    }

    const files = await File.find({ team: teamId })
      .populate('uploadedBy', 'fullName')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      files
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = { uploadFile, getTeamFiles }
