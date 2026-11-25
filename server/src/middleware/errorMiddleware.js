
const multer = require('multer')

const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  })
}

const errorHandler = (err, req, res, next) => {
  console.error('Backend Error:', err.message)

  let statusCode = res.statusCode >= 400 ? res.statusCode : 500
  let message = err.message || 'Internal server error.'

  // Multer file upload errors
  if (err instanceof multer.MulterError) {
    statusCode = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400

    message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'File size must not exceed 10 MB.'
        : err.message
  }

  // Unsupported file type
  if (err.message === 'This file type is not allowed.') {
    statusCode = 400
    message = err.message
  }

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? 'Internal server error.'
        : message
  })
}

module.exports = { notFound, errorHandler }


// const notFound = (req, res, next) => {
//   res.status(404).json({
//     success: false,
//     message: `Route not found: ${req.originalUrl}`
//   })
// }

// const errorHandler = (err, req, res, next) => {
//   const statusCode = res.statusCode >= 400 ? res.statusCode : 500

//   console.error('Backend Error:', err.message)

//   res.status(statusCode).json({
//     success: false,
//     message:
//       statusCode === 500
//         ? 'Internal server error.'
//         : err.message
//   })
// }

// module.exports = { notFound, errorHandler }
