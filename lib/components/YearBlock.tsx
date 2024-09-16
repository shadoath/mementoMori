import { useBaseContext, WEEKS_PER_YEAR } from '../../context/BaseContext'
import { getDaysInMonth } from '../../app/functions'

export const YearBlock = ({ yearCount }: { yearCount: number }) => {
  const { birthdate, lifeExpectancy } = useBaseContext()
  let numberOfDaysPerSquare: number
  const currentTime = new Date().getTime()
  let baseYear = birthdate.getFullYear()

  const year = baseYear + yearCount

  return (
    <div className='year-wrapper' key={year}>
      <h2 className='year-label'>{year}</h2>
      <div className='year-cell'>
        {Array.from({ length: 12 }, (_, i) => {
          numberOfDaysPerSquare = getDaysInMonth(i + 1, year) / 4
          return (
            <div className='month-cell' key={i}>
              {Array.from({ length: 4 }, (_, j) => {
                const weekId = `${year}-${i + 1}-${j + 1}`
                const weekDateEpoch = new Date(weekId).getTime()
                const isFilled = weekDateEpoch < currentTime
                const thisYearDate = new Date(
                  year,
                  i,
                  Math.floor((j + 1) * numberOfDaysPerSquare)
                )
                const isAfterToday = thisYearDate.getTime() > currentTime
                const isInvisible = thisYearDate < birthdate
                const isExtraWeek =
                  new Date(birthdate).getTime() +
                    lifeExpectancy * WEEKS_PER_YEAR * 7 * 24 * 60 * 60 * 1000 >
                    weekDateEpoch && isFilled

                return (
                  <div
                    id={weekId}
                    key={j}
                    className={`week-cell ${isFilled ? 'filled' : ''} ${
                      isInvisible ? 'invisible' : ''
                    } ${isExtraWeek ? 'extra' : ''} `}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
