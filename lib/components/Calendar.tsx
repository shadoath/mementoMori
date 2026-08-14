import { useMemo } from 'react'
import { getWeekIdFromDate, getYearsToDisplay } from '../../app/functions'
import {
  type LifeEvent,
  MAX_LIFE_EXPECTANCY,
  useBaseContext,
} from '../../context/BaseContext'
import { YearBlock } from './YearBlock'

const YEARS_PER_DECADE = 10

export const Calendar = () => {
  const { birthdate, lifeExpectancy, lifeEvents } = useBaseContext()
  const baseYear = birthdate.getFullYear()
  const totalYearsToDisplay = getYearsToDisplay(
    birthdate,
    lifeExpectancy,
    MAX_LIFE_EXPECTANCY
  )

  const eventsByWeek = useMemo(() => {
    const byWeek = new Map<string, LifeEvent[]>()
    for (const event of lifeEvents) {
      // An event a few days before the birthdate shares a square with it, so
      // the square is visible — but the event still predates the life.
      if (event.date < birthdate) {
        continue
      }

      const weekId = getWeekIdFromDate(event.date)
      const existing = byWeek.get(weekId)
      if (existing) {
        existing.push(event)
      } else {
        byWeek.set(weekId, [event])
      }
    }
    return byWeek
  }, [lifeEvents, birthdate])

  const currentWeekId = getWeekIdFromDate(new Date())

  // `<=` so the final, partial year of life still gets a block.
  const ages = Array.from({ length: totalYearsToDisplay + 1 }, (_, i) => i)
  const decades: number[][] = []
  for (let i = 0; i < ages.length; i += YEARS_PER_DECADE) {
    decades.push(ages.slice(i, i + YEARS_PER_DECADE))
  }

  return (
    <div className='calendar' id='calendar'>
      {decades.map((decade) => (
        <div className='decade' key={decade[0]}>
          <div className='decade-mark'>
            <span className='decade-age'>{decade[0]}</span>
            <span className='decade-year'>{baseYear + decade[0]}</span>
          </div>
          <div className='decade-years'>
            {decade.map((age) => (
              <YearBlock
                key={baseYear + age}
                yearCount={age}
                eventsByWeek={eventsByWeek}
                currentWeekId={currentWeekId}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
