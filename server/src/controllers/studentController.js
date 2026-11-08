const User = require('../models/User')

const getStudents = async (req, res) => {
  try {
    const { search, skill } = req.query

    // Current logged-in student ko exclude karo
    const filter = {
      _id: { $ne: req.user.id }
    }

    // Search by name or department
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ]
    }

    // Filter by skill
    if (skill) {
      filter.skills = {
        $regex: skill,
        $options: 'i'
      }
    }

    const students = await User.find(filter)
      .select('fullName email department semester bio skills interests github linkedin')
      .lean()

    // Logged-in student's skills and interests
    const currentUser = await User.findById(req.user.id)

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'Your profile was not found.'
      })
    }

    const mySkills = (currentUser.skills || []).map(s => s.toLowerCase())
    const myInterests = (currentUser.interests || []).map(i => i.toLowerCase())

    // Calculate matching score
    const results = students.map(student => {
      const studentSkills = (student.skills || []).map(s => s.toLowerCase())
      const studentInterests = (student.interests || []).map(i => i.toLowerCase())

      const commonSkills = mySkills.filter(skill =>
        studentSkills.includes(skill)
      )

      const commonInterests = myInterests.filter(interest =>
        studentInterests.includes(interest)
      )

      const skillScore = mySkills.length
        ? (commonSkills.length / mySkills.length) * 70
        : 0

      const interestScore = myInterests.length
        ? (commonInterests.length / myInterests.length) * 30
        : 0

      return {
        ...student,
        matchingScore: Math.round(skillScore + interestScore),
        commonSkills,
        commonInterests
      }
    })

    // Highest matching students first
    results.sort((a, b) => b.matchingScore - a.matchingScore)

    res.status(200).json({
      success: true,
      count: results.length,
      students: results
    })
  } catch (error) {
    console.error('Get Students Error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Unable to fetch students.'
    })
  }
}

const getStudentById = async (req, res) => {
  try {
    const student = await User.findById(req.params.id)
      .select('fullName email department semester bio skills interests github linkedin')

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.'
      })
    }

    res.status(200).json({
      success: true,
      student
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to fetch student profile.'
    })
  }
}


module.exports = {
  getStudents,
  getStudentById
}