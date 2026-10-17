import { configureStore } from '@reduxjs/toolkit'
import authReducer, { USERS_KEY, CURRENT_USER_KEY } from './authSlice'
import eventsReducer from './eventsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
  },
})

// Save auth data to Local Storage whenever it changes
let previousAuth = store.getState().auth

store.subscribe(() => {
  const { auth } = store.getState()
  if (auth === previousAuth) return

  if (auth.users !== previousAuth.users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(auth.users))
  }
  if (auth.currentUser !== previousAuth.currentUser) {
    if (auth.currentUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(auth.currentUser))
    } else {
      localStorage.removeItem(CURRENT_USER_KEY)
    }
  }

  previousAuth = auth
})
