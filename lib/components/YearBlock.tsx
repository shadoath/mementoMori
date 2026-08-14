import {
  MS_PER_WEEK,
  SQUARES_PER_MONTH,
  getSquareEndDate,
  getWeekId,
  startOfDay,
} from '../../app/functions'
import {
  type LifeEvent,
  WEEKS_PER_YEAR,
  useBaseContext,
} from '../../context/BaseContext'

const MONTHS_PER_YEAR = 12

export const YearBlock = ({
  yearCount,
  eventsByWeek,
}: {
  yearCount: number
  eventsByWeek: Map<string, LifeEvent[]>
}) => {
  const { birthdate, lifeExpectancy } = useBaseContext()
  const today = startOfDay(new Date())
  const year = birthdate.getFullYear() + yearCount
  const endOfExpectancy =
    birthdate.getTime() + lifeExpectancy * WEEKS_PER_YEAR * MS_PER_WEEK

  return (
    <div className='year-wrapper'>
      <h2 className='year-label'>{year}</h2>
      <div className='year-cell'>
        {Array.from({ length: MONTHS_PER_YEAR }, (_, monthIndex) => (
          <div className='month-cell' key={monthIndex}>
            {Array.from({ length: SQUARES_PER_MONTH }, (_, square) => {
              const weekId = getWeekId(year, monthIndex, square)
              const squareEnd = getSquareEndDate(year, monthIndex, square)

              // Strictly before today: the square's last day has to be over
              // before it counts as lived.
              const isFilled = squareEnd < today
              const isInvisible = squareEnd < birthdate
              const isExtra = isFilled && squareEnd.getTime() > endOfExpectancy
              // An event before the birthdate would otherwise paint a square in
              // the blank run leading up to it.
              const events = isInvisible ? undefined : eventsByWeek.get(weekId)

              return (
                <div
                  id={weekId}
                  key={square}
                  className={[
                    'week-cell',
                    isFilled ? 'filled' : '',
                    isInvisible ? 'invisible' : '',
                    isExtra ? 'extra' : '',
                    events ? 'has-tooltip' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={
                    events
                      ? {
                          backgroundColor: events[0].color,
                          borderColor: events[0].color,
                        }
                      : undefined
                  }
                  data-tooltip={
                    events
                      ? events.map((event) => event.description).join(' · ')
                      : undefined
                  }
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
