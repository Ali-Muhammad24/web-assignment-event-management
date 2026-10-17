import { Link } from 'react-router-dom'
import './EventCard.css'

// "2026-10-24" + "19:30:00" -> "Sat, 24 Oct 2026, 19:30"
function formatDate(date, time) {
  if (!date) return 'Date to be announced'
  // Adding a time makes the browser read it as local time, not UTC
  const d = new Date(`${date}T${time || '00:00:00'}`)
  const day = d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  if (!time) return day
  const hour = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return `${day}, ${hour}`
}

// One event in the grid; the whole card links to its details page
function EventCard({ event }) {
  return (
    <Link to={`/events/${event.id}`} className="event-card">
      {event.image ? (
        <img src={event.image} alt={event.name} className="event-card-image" loading="lazy" />
      ) : (
        <div className="event-card-image event-card-no-image">No image</div>
      )}

      <div className="event-card-body">
        <span className="event-card-category">{event.category}</span>
        <h3 className="event-card-name">{event.name}</h3>
        <p className="event-card-date">{formatDate(event.date, event.time)}</p>
        <p className="event-card-place">
          {event.venue}
          {event.city && `, ${event.city}`}
        </p>
      </div>
    </Link>
  )
}

export default EventCard
