import { useBaseContext } from '../../context/BaseContext'
import { YearBlock } from './YearBlock'

export const Calendar = () => {
  const { birthdate, lifeExpectancy } = useBaseContext()
  const baseYear = birthdate.getFullYear()
  const yearsAlive = new Date().getFullYear() - baseYear
  let totalYearsToDisplay = lifeExpectancy
  if (yearsAlive > lifeExpectancy) {
    // extend calendar if we're past the life expectancy
    totalYearsToDisplay = yearsAlive
  }
  const years: JSX.Element[] = []

  for (let i = 0; i <= totalYearsToDisplay; i++) {
    years.push(<YearBlock yearCount={i} />)
  }

  return (
    <div className='calendar' id='calendar'>
      {years}
    </div>
  )
}
