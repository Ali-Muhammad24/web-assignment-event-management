import { createSlice } from '@reduxjs/toolkit'

// Local Storage key
export const REGISTRATIONS_KEY = 'registrations'

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
  // Every user's registrations; each one has a userId linking it to its user
  items: loadFromStorage(REGISTRATIONS_KEY, []),
}

const registrationsSlice = createSlice({
  name: 'registrations',
  initialState,
  reducers: {
    registerForEvent(state, action) {
      const { userId, event } = action.payload

      // Prevent duplicates: one registration per user per event
      const exists = state.items.some(
        (item) => item.userId === userId && item.eventId === event.id,
      )
      if (exists) return

      state.items.push({
        id: Date.now().toString(),
        userId,
        eventId: event.id,
        registeredAt: new Date().toISOString(),
        // Keep a copy of the event so My Events can show it without refetching
        event: {
          id: event.id,
          name: event.name,
          date: event.date,
          time: event.time,
          dateTime: event.dateTime,
          venue: event.venue,
          city: event.city,
          category: event.category,
          image: event.image,
        },
      })
    },

    cancelRegistration(state, action) {
      const { userId, eventId } = action.payload
      state.items = state.items.filter(
        (item) => !(item.userId === userId && item.eventId === eventId),
      )
    },
  },
})

// All registrations belonging to one user
export function selectUserRegistrations(state, userId) {
  return state.registrations.items.filter((item) => item.userId === userId)
}

// Whether a user is registered for an event
export function selectIsRegistered(state, userId, eventId) {
  return state.registrations.items.some(
    (item) => item.userId === userId && item.eventId === eventId,
  )
}

export const { registerForEvent, cancelRegistration } = registrationsSlice.actions
export default registrationsSlice.reducer
