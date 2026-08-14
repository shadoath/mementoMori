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
  currentWeekId,
}: {
  yearCount: number
  eventsByWeek: Map<string, LifeEvent[]>
  currentWeekId: string
}) => {
  const { birthdate, lifeExpectancy } = useBaseContext()
  const today = startOfDay(new Date())
  const year = birthdate.getFullYear() + yearCount
  const endOfExpectancy =
    birthdate.getTime() + lifeExpectancy * WEEKS_PER_YEAR * MS_PER_WEEK

  return (
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
            const isCurrent = !isInvisible && weekId === currentWeekId
            // An event before the birthdate would otherwise paint a square in
            // the blank run leading up to it.
            const events = isInvisible ? undefined : eventsByWeek.get(weekId)

            const tooltip = isCurrent
              ? ['This week', ...(events ?? []).map((e) => e.description)].join(
                  ' · '
                )
              : events?.map((event) => event.description).join(' · ')

            return (
              <div
                id={weekId}
                key={square}
                className={[
                  'week-cell',
                  isFilled ? 'filled' : '',
                  isInvisible ? 'invisible' : '',
                  isExtra ? 'extra' : '',
                  isCurrent ? 'current' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                // An event keeps its own colour even in the current week; the
                // rubric ring still marks it, so neither signal is lost.
                style={
                  events
                    ? {
                        backgroundColor: events[0].color,
                        borderColor: events[0].color,
                      }
                    : undefined
                }
                data-tooltip={tooltip}
                // data-tooltip is a CSS affordance, so a marked square needs a
                // real name to be worth stopping on.
                role={tooltip ? 'img' : undefined}
                aria-label={tooltip}
                tabIndex={tooltip ? 0 : undefined}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
