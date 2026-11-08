
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    department: {
      type: String,
      default: ''
    },

    semester: {
      type: Number,
      min: 1,
      max: 12
    },

    bio: {
      type: String,
      default: ''
    },

    skills: {
      type: [String],
      default: []
    },

    interests: {
      type: [String],
      default: []
    },

    github: {
      type: String,
      default: ''
    },

    linkedin: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('User', userSchema)

module.exports = User
