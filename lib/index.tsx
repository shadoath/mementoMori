import { Calendar } from '../lib/components/Calendar'
import { HydrationGate } from '../lib/components/HydrationGate'
import { EventList } from '../lib/components/LifeEvents'
import { Quote } from '../lib/components/Quote'
import { Stats } from '../lib/components/Stats'
import { SettingsDialog } from './components/SettingsDialog'

export const MementoMori = () => {
  return (
    <div className='App'>
      <header className='masthead'>
        <h1 className='wordmark'>Memento Mori</h1>
        <p className='masthead-rule'>One square, one week</p>
      </header>

      <HydrationGate>
        <Calendar />
        <Stats />
        <EventList />
      </HydrationGate>

      <Quote />

      <HydrationGate>
        <SettingsDialog />
      </HydrationGate>
    </div>
  )
}
