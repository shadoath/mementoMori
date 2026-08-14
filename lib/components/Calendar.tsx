import { useMemo } from 'react'
import { getWeekIdFromDate } from '../../app/functions'
import {
  type LifeEvent,
  MAX_LIFE_EXPECTANCY,
  useBaseContext,
} from '../../context/BaseContext'
import { YearBlock } from './YearBlock'

export const Calendar = () => {
  const { birthdate, lifeExpectancy, lifeEvents } = useBaseContext()
  const baseYear = birthdate.getFullYear()
  const yearsAlive = new Date().getFullYear() - baseYear
  // Extend the calendar if we're past the life expectancy, but keep a ceiling:
  // a half-typed year like 0002 would otherwise ask for ~2000 blocks of 48
  // cells each and lock up the page.
  const totalYearsToDisplay = Math.min(
    MAX_LIFE_EXPECTANCY,
    Math.max(lifeExpectancy, yearsAlive)
  )

  const eventsByWeek = useMemo(() => {
    const byWeek = new Map<string, LifeEvent[]>()
    for (const event of lifeEvents) {
      const weekId = getWeekIdFromDate(event.date)
      const existing = byWeek.get(weekId)
      if (existing) {
        existing.push(event)
      } else {
        byWeek.set(weekId, [event])
      }
    }
    return byWeek
  }, [lifeEvents])

  // `<=` so the final, partial year of life still gets a block.
  const years = Array.from({ length: totalYearsToDisplay + 1 }, (_, i) => (
    <YearBlock key={baseYear + i} yearCount={i} eventsByWeek={eventsByWeek} />
  ))

  return (
    <div className='calendar' id='calendar'>
      {years}
    </div>
  )
}
