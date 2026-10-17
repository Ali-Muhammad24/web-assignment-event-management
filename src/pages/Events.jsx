import { Link } from 'react-router-dom'

// Placeholder: the real events list is built in Day 1, Step 7
function Events() {
  return (
    <div style={{ padding: '48px 16px' }}>
      <h2>Events</h2>
      <p>The events list is coming in Step 7.</p>
      <p>
        <Link to="/events/test">Open a sample event</Link>
      </p>
    </div>
  )
}

export default Events
