import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

// Only show the page to logged-in users; others are sent to Login,
// remembering where they wanted to go so Login can send them back
function ProtectedRoute({ children }) {
  const currentUser = useSelector((state) => state.auth.currentUser)
  const location = useLocation()

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export default ProtectedRoute
