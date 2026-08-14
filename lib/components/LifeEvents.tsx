import { formatDateInput } from '../../app/functions'
import { useBaseContext } from '../../context/BaseContext'

export const EventList = () => {
  const { lifeEvents } = useBaseContext()

  if (lifeEvents.length === 0) {
    return null
  }

  const sorted = [...lifeEvents].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  )

  return (
    <ul id='life-events' className='life-events wrapper'>
      {sorted.map((event, i) => (
        <li className='life-event' key={`${formatDateInput(event.date)}-${i}`}>
          <span
            aria-hidden='true'
            className='life-event-swatch'
            style={{ backgroundColor: event.color }}
          />
          <time dateTime={formatDateInput(event.date)}>
            {formatDateInput(event.date)}
          </time>
          <span className='life-event-description'>
            {event.icon ? `${event.icon} ` : ''}
            {event.description}
          </span>
        </li>
      ))}
    </ul>
  )
}
