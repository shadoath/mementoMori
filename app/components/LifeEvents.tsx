import { getWeekIdFromDate } from '../functions'

export type LifeEvent = {
  date: Date
  description: string
  color: string
  icon?: string
}

export const EventList = ({ events }: { events: LifeEvent[] }) => {
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
      {events.map((e) => {
        writeLifeEvent(e)
        return null
      })}
    </div>
  )
}
