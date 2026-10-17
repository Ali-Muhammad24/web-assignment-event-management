import { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

// Temporary page switcher for testing; replaced by React Router in Step 5
function App() {
  const [page, setPage] = useState('login')

  return (
    <>
      <div className="page-switcher">
        <button
          type="button"
          className={page === 'login' ? 'active' : ''}
          onClick={() => setPage('login')}
        >
          Login
        </button>
        <button
          type="button"
          className={page === 'register' ? 'active' : ''}
          onClick={() => setPage('register')}
        >
          Register
        </button>
      </div>

      {page === 'login' ? <Login /> : <Register />}
    </>
  )
}

export default App
