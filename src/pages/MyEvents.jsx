import { useSelector } from 'react-redux'

// Placeholder: the real My Events page is built in Day 2, Step 3
function MyEvents() {
  const currentUser = useSelector((state) => state.auth.currentUser)

  return (
    <div style={{ padding: '48px 16px' }}>
      <h2>My Events</h2>
      <p>Hi {currentUser.name}, your registered events will appear here in Day 2.</p>
    </div>
  )
}

export default MyEvents
