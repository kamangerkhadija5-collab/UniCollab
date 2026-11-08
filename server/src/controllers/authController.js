const jwt = require('jsonwebtoken')
const User = require('../models/User')
const bcrypt = require('bcryptjs')

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields.'
      })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const existingUser = await User.findOne({
      email: normalizedEmail
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered.'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      fullName,
      email: normalizedEmail,
      password: hashedPassword
    })

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    })

  } catch (error) {
    console.error('Signup Error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Server error during registration.'
    })
  }
}


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      })
    }

    // Find user by email and include password
    const user = await User.findOne({
      email: email.trim().toLowerCase()
    }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      })
    }

    // Compare entered password with hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    )

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    // Send successful response
    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    })

  } catch (error) {
    console.error('Login Error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Server error during login.'
    })
  }
}


// Get currently logged-in user
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      })
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        department: user.department,
        semester: user.semester,
        bio: user.bio,
        skills: user.skills,
        interests: user.interests,
        github: user.github,
        linkedin: user.linkedin
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to fetch profile.'
    })
  }
}



const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      department,
      semester,
      bio,
      skills,
      interests,
      github,
      linkedin
    } = req.body

    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      })
    }

    if (fullName !== undefined) user.fullName = fullName
    if (department !== undefined) user.department = department
    if (semester !== undefined) user.semester = semester
    if (bio !== undefined) user.bio = bio
    if (skills !== undefined) user.skills = skills
    if (interests !== undefined) user.interests = interests
    if (github !== undefined) user.github = github
    if (linkedin !== undefined) user.linkedin = linkedin

    await user.save()

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        department: user.department,
        semester: user.semester,
        bio: user.bio,
        skills: user.skills,
        interests: user.interests,
        github: user.github,
        linkedin: user.linkedin
      }
    })
  } catch (error) {
    console.error('Profile Update Error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Unable to update profile.'
    })
  }
}

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile
}

