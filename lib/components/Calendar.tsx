import { useMemo } from 'react'
import { getWeekIdFromDate, getYearsToDisplay } from '../../app/functions'
import {
  type LifeEvent,
  MAX_LIFE_EXPECTANCY,
  useBaseContext,
} from '../../context/BaseContext'
import { YearBlock } from './YearBlock'

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
