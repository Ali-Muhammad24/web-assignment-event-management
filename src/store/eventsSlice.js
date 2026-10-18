import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API_URL = 'https://app.ticketmaster.com/discovery/v2/events.json'
const EVENT_URL = 'https://app.ticketmaster.com/discovery/v2/events'
const API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY

// Current time in the format Ticketmaster expects: YYYY-MM-DDTHH:mm:ssZ (no milliseconds)
function nowForApi() {
  return new Date().toISOString().split('.')[0] + 'Z'
}

// Ticketmaster sends "Undefined" when a classification is unknown; treat it as missing
function validName(name) {
  return name && name !== 'Undefined' ? name : null
}

// Turn Ticketmaster's nested event object into a flat, easy-to-use one
function simplifyEvent(event) {
  const venue = event._embedded?.venues?.[0]
  const price = event.priceRanges?.[0]
  const classification = event.classifications?.[0]
  // Pick the widest image so cards and details look sharp
  const image = event.images?.length
    ? [...event.images].sort((a, b) => b.width - a.width)[0].url
    : null

  return {
    id: event.id,
    name: event.name,
    date: event.dates?.start?.localDate || null,
    time: event.dates?.start?.localTime || null,
    // Exact start in UTC (e.g. "2026-10-24T18:30:00Z"); missing when the time is TBA
    dateTime: event.dates?.start?.dateTime || null,
    image,
    venue: venue?.name || 'Venue to be announced',
    city: venue?.city?.name || '',
    category:
      validName(classification?.segment?.name) ||
      validName(classification?.genre?.name) ||
      'Other',
    url: event.url || null,
    priceRange: price ? { min: price.min, max: price.max, currency: price.currency } : null,
    info: event.info || event.pleaseNote || '',
  }
}

// Fetch upcoming events, optionally filtered by keyword, category and city
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async ({ keyword, category, city } = {}, { rejectWithValue }) => {
    const params = new URLSearchParams({
      apikey: API_KEY,
      size: '20',
      sort: 'date,asc',
      startDateTime: nowForApi(),
    })
    if (keyword) params.append('keyword', keyword)
    if (category) params.append('classificationName', category)
    if (city) params.append('city', city)

    try {
      const response = await fetch(`${API_URL}?${params}`)

      if (!response.ok) {
        if (response.status === 401) {
          return rejectWithValue('Invalid API key. Please check your .env file.')
        }
        if (response.status === 429) {
          return rejectWithValue('Too many requests. Please wait a moment and try again.')
        }
        return rejectWithValue(`Failed to load events (error ${response.status}).`)
      }

      const data = await response.json()
      // Ticketmaster leaves out _embedded when there are no results
      const events = data._embedded?.events || []
      return events.map(simplifyEvent)
    } catch {
      return rejectWithValue('Network error. Please check your connection.')
    }
  },
)

// Fetch a single event by its Ticketmaster id (for the details page)
export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (id, { rejectWithValue }) => {
    const params = new URLSearchParams({ apikey: API_KEY })

    try {
      const response = await fetch(`${EVENT_URL}/${encodeURIComponent(id)}.json?${params}`)

      if (!response.ok) {
        if (response.status === 404) {
          return rejectWithValue('Event not found.')
        }
        if (response.status === 401) {
          return rejectWithValue('Invalid API key. Please check your .env file.')
        }
        if (response.status === 429) {
          return rejectWithValue('Too many requests. Please wait a moment and try again.')
        }
        return rejectWithValue(`Failed to load event (error ${response.status}).`)
      }

      const data = await response.json()
      return simplifyEvent(data)
    } catch {
      return rejectWithValue('Network error. Please check your connection.')
    }
  },
)

const initialState = {
  items: [],
  loading: false,
  error: null,
  // The event open on the details page, kept apart from the list
  selected: null,
  selectedLoading: false,
  selectedError: null,
  selectedRequestId: null,
}

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearEventsError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Something went wrong.'
      })
      .addCase(fetchEventById.pending, (state, action) => {
        state.selected = null
        state.selectedLoading = true
        state.selectedError = null
        state.selectedRequestId = action.meta.requestId
      })
      // Ignore answers from older requests (e.g. user switched events quickly)
      .addCase(fetchEventById.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.selectedRequestId) return
        state.selectedLoading = false
        state.selected = action.payload
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        if (action.meta.requestId !== state.selectedRequestId) return
        state.selectedLoading = false
        state.selectedError = action.payload || 'Something went wrong.'
      })
  },
})

export const { clearEventsError } = eventsSlice.actions
export default eventsSlice.reducer
