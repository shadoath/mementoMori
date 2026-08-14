import {
  MS_PER_WEEK,
  SQUARES_PER_MONTH,
  getSquareEndDate,
  getWeekId,
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
  const currentTime = new Date().getTime()
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
              const squareEndTime = squareEnd.getTime()

              const isFilled = squareEndTime <= currentTime
              const isInvisible = squareEnd < birthdate
              const isExtra = isFilled && squareEndTime > endOfExpectancy
              const events = eventsByWeek.get(weekId)

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
