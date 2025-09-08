import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children, requiredRole = null }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  
  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  // If a specific role is required and user doesn't have it, redirect to home
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />
  }
  
  return children
}
