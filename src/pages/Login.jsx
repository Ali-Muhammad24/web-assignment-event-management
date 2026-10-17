import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, clearAuthError } from '../store/authSlice'
import './AuthForm.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Return an object of field errors; empty object means the form is valid
function validate({ email, password }) {
  const errors = {}

  if (!email.trim()) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (!password) {
    errors.password = 'Password is required.'
  }

  return errors
}

function Login() {
  const dispatch = useDispatch()
  const { currentUser, error } = useSelector((state) => state.auth)

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  // Clear any error left over from another page
  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    if (error) dispatch(clearAuthError())
  }

  function handleSubmit(e) {
    e.preventDefault()
    const newErrors = validate(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    dispatch(login(form))
  }

  // Temporary until routing: Step 5 will redirect to the Events page instead
  if (currentUser) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p className="auth-success">Logged in as {currentUser.name}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h2>Log in</h2>

        {error && <p className="auth-error-banner">{error}</p>}

        <div className="auth-field">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
          {errors.email && <p className="auth-field-error">{errors.email}</p>}
        </div>

        <div className="auth-field">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="auth-field-error">{errors.password}</p>
          )}
        </div>

        <button type="submit" className="auth-submit">
          Log in
        </button>
      </form>
    </div>
  )
}

export default Login
