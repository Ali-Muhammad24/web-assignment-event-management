import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import MyEvents from './pages/MyEvents'
import './App.css'

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to="/events" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route
          path="/my-events"
          element={
            <ProtectedRoute>
              <MyEvents />
            </ProtectedRoute>
          }
        />
        {/* Unknown URLs go back to the events list */}
        <Route path="*" element={<Navigate to="/events" replace />} />
      </Routes>
    </>
  )
}

export default App
