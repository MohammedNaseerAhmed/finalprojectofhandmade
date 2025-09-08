import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

export const http = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
})


// Attach token if present
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})


