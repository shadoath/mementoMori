import { Calendar } from '../lib/components/Calendar'
import { EventList } from '../lib/components/LifeEvents'
import { Quote } from '../lib/components/Quote'
import { Stats } from '../lib/components/Stats'

export const MementoMori = () => {
  return (
    <div className='App'>
      <h2 style={{ textAlign: 'center' }}>MEMENTO MORI </h2>
      <Calendar />
      <Stats />
      <EventList />
      <Quote />
    </div>
  )
}
