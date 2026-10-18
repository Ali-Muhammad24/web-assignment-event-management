import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { cancelRegistration } from '../store/registrationsSlice'
import EventCard from '../components/EventCard'
import './Events.css'
import './MyEvents.css'

// When an event counts as over, in milliseconds.
// Prefer the UTC dateTime so timezones don't matter. Fall back to the local
// date for older registrations and TBA times: no time -> over at the end of
// that day; no date at all -> never over.
function eventEndTime(event) {
  if (event.dateTime) {
    const utc = Date.parse(event.dateTime)
    if (!Number.isNaN(utc)) return utc
  }
  if (!event.date) return Infinity
  return new Date(`${event.date}T${event.time || '23:59:59'}`).getTime()
}

function MyEvents() {
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.auth.currentUser)
  const allRegistrations = useSelector((state) => state.registrations.items)

  const [message, setMessage] = useState('')

  // Filter in useMemo so the selector returns the same array between renders
  const { upcoming, completed } = useMemo(() => {
    const now = Date.now()
    const mine = allRegistrations.filter((item) => item.userId === currentUser.id)

    return {
      // Soonest first
      upcoming: mine
        .filter((item) => eventEndTime(item.event) >= now)
        .sort((a, b) => eventEndTime(a.event) - eventEndTime(b.event)),
      // Most recent first
      completed: mine
        .filter((item) => eventEndTime(item.event) < now)
        .sort((a, b) => eventEndTime(b.event) - eventEndTime(a.event)),
    }
  }, [allRegistrations, currentUser.id])

  function handleCancel(item) {
    dispatch(cancelRegistration({ userId: currentUser.id, eventId: item.eventId }))
    setMessage(`Your registration for "${item.event.name}" has been cancelled.`)
  }

  function renderSection(title, items, emptyText, canCancel) {
    return (
      <section className="my-events-section">
        <h3>
          {title} <span className="my-events-count">({items.length})</span>
        </h3>

        {items.length === 0 ? (
          <p className="my-events-section-empty">{emptyText}</p>
        ) : (
          <div className={`events-grid${canCancel ? '' : ' my-events-completed'}`}>
            {items.map((item) => (
              <div key={item.id} className="my-events-item">
                <EventCard event={item.event} />
                {canCancel && (
                  <button
                    type="button"
                    className="my-events-cancel"
                    onClick={() => handleCancel(item)}
                  >
                    Cancel registration
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    )
  }

  const hasNone = upcoming.length === 0 && completed.length === 0

  return (
    <div className="events-page">
      <h2>My Events</h2>

      {message && (
        <p className="my-events-message" role="status">
          {message}
        </p>
      )}

      {hasNone ? (
        <div className="my-events-empty">
          <p>You haven't registered for any events yet.</p>
          <Link to="/events" className="my-events-browse">
            Browse events
          </Link>
        </div>
      ) : (
        <>
          {renderSection('Upcoming', upcoming, 'No upcoming events.', true)}
          {renderSection('Completed', completed, 'No completed events yet.', false)}
        </>
      )}
    </div>
  )
}

export default MyEvents
