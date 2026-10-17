import { createSlice } from '@reduxjs/toolkit'

// Local Storage keys
export const USERS_KEY = 'users'
export const CURRENT_USER_KEY = 'currentUser'

// Read a JSON value from Local Storage, or return the fallback if missing/broken
function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

const initialState = {
  users: loadFromStorage(USERS_KEY, []),
  currentUser: loadFromStorage(CURRENT_USER_KEY, null),
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    register(state, action) {
      const { name, email, password } = action.payload
      const normalizedEmail = email.trim().toLowerCase()

      const exists = state.users.some((user) => user.email === normalizedEmail)
      if (exists) {
        state.error = 'An account with this email already exists.'
        return
      }

      const newUser = {
        id: Date.now().toString(),
        name: name.trim(),
        email: normalizedEmail,
        password,
      }
      state.users.push(newUser)
      state.currentUser = { id: newUser.id, name: newUser.name, email: newUser.email }
      state.error = null
    },

    login(state, action) {
      const { email, password } = action.payload
      const normalizedEmail = email.trim().toLowerCase()

      const user = state.users.find(
        (u) => u.email === normalizedEmail && u.password === password,
      )
      if (!user) {
        state.error = 'Invalid email or password.'
        return
      }

      state.currentUser = { id: user.id, name: user.name, email: user.email }
      state.error = null
    },

    logout(state) {
      state.currentUser = null
      state.error = null
    },

    clearAuthError(state) {
      state.error = null
    },
  },
})

export const { register, login, logout, clearAuthError } = authSlice.actions
export default authSlice.reducer
