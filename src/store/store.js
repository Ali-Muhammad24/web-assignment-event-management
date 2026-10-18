import { configureStore } from '@reduxjs/toolkit'
import authReducer, { USERS_KEY, CURRENT_USER_KEY } from './authSlice'
import eventsReducer from './eventsSlice'
import registrationsReducer, { REGISTRATIONS_KEY } from './registrationsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    registrations: registrationsReducer,
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

// Save registrations to Local Storage whenever they change
let previousRegistrations = store.getState().registrations.items

store.subscribe(() => {
  const { items } = store.getState().registrations
  if (items === previousRegistrations) return

  localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(items))
  previousRegistrations = items
})
