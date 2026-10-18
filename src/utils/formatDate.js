// "2026-10-24" + "19:30:00" -> "Sat, 24 Oct 2026, 19:30"
export function formatDate(date, time) {
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
