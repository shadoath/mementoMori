import { getDaysInMonth } from '../functions'

export const YearBlock = ({
  year,
  birthdate,
}: {
  year: number
  birthdate: Date
}) => {
  let numberOfDaysPerSquare: number
  const currentTime = new Date().getTime()

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
                const _date = new Date(
                  year,
                  i,
                  Math.floor((j + 1) * numberOfDaysPerSquare)
                )
                const is_invisible = _date < birthdate

                return (
                  <div
                    id={weekId}
                    key={j}
                    className={`week-cell ${isFilled ? 'filled' : ''} ${
                      is_invisible ? 'invisible' : ''
                    }`}
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
