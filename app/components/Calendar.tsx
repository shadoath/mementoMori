import { YearBlock } from './YearBlock'

export const Calendar = ({
  birthdate,
  totalYears,
}: {
  birthdate: Date
  totalYears: number
}) => {
  let baseYear = birthdate.getFullYear()
  let years: JSX.Element[] = []

  for (let i = 0; i < totalYears; i++) {
    years.push(<YearBlock year={baseYear + i} birthdate={birthdate} />)
  }

  return (
    <div className='calendar' id='calendar'>
      {years}
    </div>
  )
}
