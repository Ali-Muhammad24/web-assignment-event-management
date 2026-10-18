import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchEventById } from '../store/eventsSlice'
import { formatDate } from '../utils/formatDate'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import './EventDetails.css'

// { min: 25, max: 80, currency: 'GBP' } -> "£25.00 – £80.00"
function formatPrice(priceRange) {
  if (!priceRange) return 'Price not available'
  const { min, max, currency } = priceRange
  const format = (value) =>
    new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency || 'USD' }).format(value)

  if (min == null && max == null) return 'Price not available'
  if (min == null || max == null || min === max) return format(min ?? max)
  return `${format(min)} – ${format(max)}`
}

function EventDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { selected: event, selectedLoading, selectedError } = useSelector((state) => state.events)

  // Fetch again whenever the id in the URL changes
  useEffect(() => {
    dispatch(fetchEventById(id))
  }, [dispatch, id])

  function renderContent() {
    if (selectedLoading) return <Loader text="Loading event..." />
    if (selectedError) {
      return <ErrorMessage message={selectedError} onRetry={() => dispatch(fetchEventById(id))} />
    }
    if (!event) return null

    return (
      <article className="details">
        {event.image ? (
          <img src={event.image} alt={event.name} className="details-image" />
        ) : (
          <div className="details-image details-no-image">No image</div>
        )}

        <div className="details-body">
          <span className="details-category">{event.category}</span>
          <h2 className="details-name">{event.name}</h2>

          <dl className="details-facts">
            <dt>Date &amp; time</dt>
            <dd>{formatDate(event.date, event.time)}</dd>

            <dt>Venue</dt>
            <dd>{event.venue}</dd>

            <dt>City</dt>
            <dd>{event.city || 'Not specified'}</dd>

            <dt>Price range</dt>
            <dd>{formatPrice(event.priceRange)}</dd>
          </dl>

          {event.url && (
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="details-tickets"
            >
              Buy tickets
            </a>
          )}

          {event.info && (
            <section className="details-info">
              <h3>About this event</h3>
              <p>{event.info}</p>
            </section>
          )}
        </div>
      </article>
    )
  }

  return (
    <div className="details-page">
      <Link to="/events" className="details-back">
        ← Back to events
      </Link>
      {renderContent()}
    </div>
  )
}

export default EventDetails
