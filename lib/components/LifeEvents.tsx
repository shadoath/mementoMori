import {
  formatDateInput,
  getSquareEndDateForDate,
  getYearsToDisplay,
} from '../../app/functions'
import { MAX_LIFE_EXPECTANCY, useBaseContext } from '../../context/BaseContext'

export const EventList = () => {
  const { birthdate, lifeExpectancy, lifeEvents } = useBaseContext()

  if (lifeEvents.length === 0) {
    return null
  }

  const lastYear =
    birthdate.getFullYear() +
    getYearsToDisplay(birthdate, lifeExpectancy, MAX_LIFE_EXPECTANCY)

  // Mirrors the calendar: a square is blank before the birthdate, and there is
  // no square at all past the last year drawn.
  const isOnCalendar = (date: Date) =>
    getSquareEndDateForDate(date) >= birthdate && date.getFullYear() <= lastYear

  const sorted = [...lifeEvents].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  )

  return (
    <ul id='life-events' className='life-events wrapper'>
      {sorted.map((event, i) => {
        const onCalendar = isOnCalendar(event.date)

        return (
          <li
            className={`life-event ${onCalendar ? '' : 'life-event-off-calendar'}`}
            key={`${formatDateInput(event.date)}-${i}`}
          >
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
            {!onCalendar && (
              <span className='life-event-note'>outside the calendar</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
