import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEvents } from '../store/eventsSlice'
import EventCard from '../components/EventCard'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import './Events.css'

// Values match Ticketmaster's classificationName filter
const CATEGORIES = ['Music', 'Sports', 'Arts & Theatre', 'Film', 'Miscellaneous']

function Events() {
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector((state) => state.events)

  // What the user is typing in the form
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')
  const [city, setCity] = useState('')

  // The filters of the last submitted search (empty = all upcoming events)
  const [search, setSearch] = useState({})

  // Fetch on first load and every time a new search is submitted
  useEffect(() => {
    dispatch(fetchEvents(search))
  }, [dispatch, search])

  function handleSubmit(e) {
    e.preventDefault()
    setSearch({ keyword: keyword.trim(), category, city: city.trim() })
  }

  function renderResults() {
    if (loading) return <Loader text="Loading events..." />
    if (error) {
      return <ErrorMessage message={error} onRetry={() => dispatch(fetchEvents(search))} />
    }
    if (items.length === 0) return <p className="events-empty">No events found.</p>

    return (
      <div className="events-grid">
        {items.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    )
  }

  return (
    <div className="events-page">
      <h2>Upcoming Events</h2>

      <form className="events-filters" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search events..."
          aria-label="Search by keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <select
          aria-label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="City"
          aria-label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {renderResults()}
    </div>
  )
}

export default Events
