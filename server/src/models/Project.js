const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['planning', 'in-progress', 'completed'],
      default: 'planning'
    },
    deadline: {
      type: Date
    }
  },
  { timestamps: true }
)

const Project = mongoose.model('Project', projectSchema)

module.exports = Project