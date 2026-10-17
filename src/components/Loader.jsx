import './Loader.css'

// Spinner shown while data is loading
function Loader({ text = 'Loading...' }) {
  return (
    <div className="loader" role="status">
      <div className="loader-spinner" />
      <p>{text}</p>
    </div>
  )
}

export default Loader
