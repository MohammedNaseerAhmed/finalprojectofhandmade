const exp = require('express')
const uploadApp = exp.Router()
const upload = require('../middleware/upload')
const { authenticate, authorizeRoles } = require('../middleware/auth')
const path = require('path')

// Serve uploaded files
uploadApp.use('/uploads', exp.static('uploads'))

// Upload single image
uploadApp.post('/image', authenticate, authorizeRoles('seller'), upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: 'No image file provided' })
    }
    
    const imageUrl = `/upload-api/uploads/${req.file.filename}`
    res.status(200).send({ 
      message: 'Image uploaded successfully', 
      payload: { imageUrl, filename: req.file.filename } 
    })
  } catch (error) {
    res.status(500).send({ message: 'Upload failed', error: error.message })
  }
})

// Upload multiple images
uploadApp.post('/images', authenticate, authorizeRoles('seller'), upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ message: 'No image files provided' })
    }
    
    const imageUrls = req.files.map(file => `/upload-api/uploads/${file.filename}`)
    res.status(200).send({ 
      message: 'Images uploaded successfully', 
      payload: { imageUrls, filenames: req.files.map(f => f.filename) } 
    })
  } catch (error) {
    res.status(500).send({ message: 'Upload failed', error: error.message })
  }
})

module.exports = uploadApp
