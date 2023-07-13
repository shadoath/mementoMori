import { LifeEvent, useBaseContext } from '../../context/BaseContext'
import { getWeekIdFromDate } from '../../app/functions'

export const EventList = () => {
  const { lifeEvents } = useBaseContext()
  const writeLifeEvent = (lifeEvent: LifeEvent) => {
    let id = getWeekIdFromDate(lifeEvent.date)
    let weekDiv = document.getElementById(id)

    if (weekDiv == null || weekDiv.classList.contains('invisible')) {
      let y = lifeEvent.date.getFullYear()
      let m = lifeEvent.date.getMonth() + 1
      let d = lifeEvent.date.getDate()
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
