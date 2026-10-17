import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { logout } from '../store/authSlice'
import './Navbar.css'

function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentUser = useSelector((state) => state.auth.currentUser)

  function handleLogout() {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/events" className="navbar-brand">
        EventHub
      </Link>

      <div className="navbar-links">
        <NavLink to="/events" end>
          Events
        </NavLink>

        {currentUser ? (
          <>
            <NavLink to="/my-events">My Events</NavLink>
            <span className="navbar-user">Hi, {currentUser.name}</span>
            <button type="button" className="navbar-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
