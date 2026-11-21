const express = require('express')
const router = express.Router()

const {
  createProject,
  getProjects
} = require('../controllers/Projectcontroller')

const protect = require('../middleware/authMiddleware')

router.post('/', protect, createProject)
router.get('/', protect, getProjects)

module.exports = router