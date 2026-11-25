
const express = require('express')
const router = express.Router()

const protect = require('../middleware/authMiddleware')
const upload = require('../config/upload')

const {
  uploadFile,
  getTeamFiles
} = require('../controllers/fileController')

router.get('/:teamId', protect, getTeamFiles)
router.post('/:teamId', protect, upload.single('file'), uploadFile)

module.exports = router
