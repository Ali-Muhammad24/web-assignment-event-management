import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { register, clearAuthError } from '../store/authSlice'
import './AuthForm.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Return an object of field errors; empty object means the form is valid
function validate({ name, email, password }) {
  const errors = {}

  if (!name.trim()) {
    errors.name = 'Name is required.'
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.'
  }

  if (!email.trim()) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (!password) {
    errors.password = 'Password is required.'
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }

  return errors
}

function Register() {
  const dispatch = useDispatch()
  const { currentUser, error } = useSelector((state) => state.auth)

  const [form, setForm] = useState({ name: '', email: '', password: '' })
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

    dispatch(register(form))
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
        <h2>Create an account</h2>

        {error && <p className="auth-error-banner">{error}</p>}

        <div className="auth-field">
          <label htmlFor="register-name">Name</label>
          <input
            id="register-name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
          />
          {errors.name && <p className="auth-field-error">{errors.name}</p>}
        </div>

        <div className="auth-field">
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
          {errors.email && <p className="auth-field-error">{errors.email}</p>}
        </div>

        <div className="auth-field">
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {errors.password && (
            <p className="auth-field-error">{errors.password}</p>
          )}
        </div>

        <button type="submit" className="auth-submit">
          Register
        </button>
      </form>
    </div>
  )
}

export default Register
