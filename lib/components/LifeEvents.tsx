import { type LifeEvent, useBaseContext } from '../../context/BaseContext'
import { getWeekIdFromDate } from '../../app/functions'

export const EventList = () => {
  const { lifeEvents } = useBaseContext()
  const writeLifeEvent = (lifeEvent: LifeEvent) => {
    const id = getWeekIdFromDate(lifeEvent.date)
    const weekDiv = document.getElementById(id)

    if (weekDiv == null || weekDiv.classList.contains('invisible')) {
      const y = lifeEvent.date.getFullYear()
      const m = lifeEvent.date.getMonth() + 1
      const d = lifeEvent.date.getDate()
      console.error(
        `Event '${lifeEvent.description}' has an invalid date (${y}-${m}-${d})`
      )
      return
    }
  }
  return (
    <div id='life-events' className='stats wrapper'>
      {lifeEvents.map((e) => {
        writeLifeEvent(e)
        return null
      })}
    </div>
  )
}
