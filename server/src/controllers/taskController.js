
const Task = require('../models/Task')
const Project = require('../models/Project')

// Create Task
const createTask = async (req, res) => {
  try {
   const {
  title,
  description,
  project,
  priority,
  dueDate,
  assignedTo
} = req.body

    if (!title || !title.trim() || !project) {
      return res.status(400).json({
        success: false,
        message: 'Task title and project are required'
      })
    }

    const selectedProject = await Project.findById(project).populate('team')

    if (!selectedProject) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      })
    }

    const isMember = selectedProject.team.members.some(
      member => member.user.toString() === req.user.id
    )

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'Only team members can create tasks'
      })
    }

if (assignedTo) {
  const isAssigneeMember = selectedProject.team.members.some(
    member => member.user.toString() === assignedTo
  )

  if (!isAssigneeMember) {
    return res.status(400).json({
      success: false,
      message: 'Assigned student must be a team member'
    })
  }
}

    const task = await Task.create({
  title: title.trim(),
  description,
  project,
  priority,
  dueDate: dueDate || undefined,
  assignedTo: assignedTo || null,
  createdBy: req.user.id
})

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Get Tasks
const getTasks = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('team')

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      })
    }

    const isMember = project.team.members.some(
      member => member.user.toString() === req.user.id
    )

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this team'
      })
    }

    const tasks = await Task.find({ project: project._id })
      .populate('assignedTo', 'fullName')
      .populate('createdBy', 'fullName')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Update Task Status
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body

    if (!['todo', 'in-progress', 'done'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task status'
      })
    }

    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      })
    }

    const project = await Project.findById(task.project).populate('team')

    const isMember = project.team.members.some(
      member => member.user.toString() === req.user.id
    )

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this team'
      })
    }

    task.status = status
    await task.save()

    res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      task
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  createTask,
  getTasks,
  updateTaskStatus
}
