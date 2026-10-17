import { useParams } from 'react-router-dom'

// Placeholder: the real details page is built in Day 2, Step 1
function EventDetails() {
  const { id } = useParams()

  return (
    <div style={{ padding: '48px 16px' }}>
      <h2>Event Details</h2>
      <p>Details for event "{id}" are coming in Day 2.</p>
    </div>
  )
}

export default EventDetails
