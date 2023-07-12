import { Calendar } from './components/Calendar'
import { LifeEvent, EventList } from './components/LifeEvents'
import { Quote } from './components/Quote'
import { Stats } from './components/Stats'
import { getWeeksLeft } from './functions'

const myBirthDate = new Date('1992-05-04')
const myLifeExpectancy = 90
const totalWeeksInLife = myLifeExpectancy * 52.1429
const lifeEvents: LifeEvent[] = []

const App = () => {
  const weeksLeft = getWeeksLeft(myBirthDate, totalWeeksInLife)

  return (
    <div className='App'>
      <h2 style={{ textAlign: 'center' }}>MEMENTO MORI </h2>
      <Calendar birthdate={myBirthDate} totalYears={myLifeExpectancy} />
      <Stats
        weeksLeft={weeksLeft}
        totalWeeksInLife={totalWeeksInLife}
        lifeExpectancy={myLifeExpectancy}
      />
      <EventList events={lifeEvents} />
      <Quote />
    </div>
  )
}

export default App
