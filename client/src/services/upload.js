import { http } from './http'

export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('image', file)
  
  const res = await http.post('/upload-api/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return res.data
}

export async function uploadImages(files) {
  const formData = new FormData()
  files.forEach(file => {
    formData.append('images', file)
  })
  
  const res = await http.post('/upload-api/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return res.data
}
