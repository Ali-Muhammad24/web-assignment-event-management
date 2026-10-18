import { Link } from 'react-router-dom'
import { formatDate } from '../utils/formatDate'
import './EventCard.css'

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
