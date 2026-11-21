
const Project = require('../models/Project')
const Team = require('../models/Team')

const Task = require('../models/Task')

// Create Project
const createProject = async (req, res) => {
  try {
    const { name, description, team, deadline } = req.body

    if (!name || !name.trim() || !team) {
      return res.status(400).json({
        success: false,
        message: 'Project name and team are required'
      })
    }

    const selectedTeam = await Team.findById(team)

    if (!selectedTeam) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    const isMember = selectedTeam.members.some(
      member => member.user.toString() === req.user.id
    )

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Only team members can create projects'
      })
    }

    const project = await Project.create({
      name: name.trim(),
      description,
      team,
      deadline: deadline || undefined,
      createdBy: req.user.id
    })

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Get Projects
const getProjects = async (req, res) => {
  try {
    const userTeams = await Team.find({
      'members.user': req.user.id
    }).select('_id')

    const teamIds = userTeams.map(team => team._id)

    const projects = await Project.find({
      team: { $in: teamIds }
    })
      .populate({
        path: 'team',
        select: 'name members',
        populate: {
          path: 'members.user',
          select: 'fullName'
        }
      })
      .populate('createdBy', 'fullName')
      .sort({ createdAt: -1 })

    // Calculate progress for each project
    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        const totalTasks = await Task.countDocuments({
          project: project._id
        })

        const completedTasks = await Task.countDocuments({
          project: project._id,
          status: 'done'
        })

        const progress = totalTasks === 0
          ? 0
          : Math.round((completedTasks / totalTasks) * 100)

        return {
          ...project.toObject(),
          totalTasks,
          completedTasks,
          progress
        }
      })
    )

    res.status(200).json({
      success: true,
      count: projects.length,
      projects: projectsWithProgress
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = { createProject, getProjects }
