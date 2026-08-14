import { useMemo } from 'react'
import { getWeeksLeft } from '../../app/functions'
import { useBaseContext } from '../../context/BaseContext'

export const Stats = () => {
  const { birthdate, lifeExpectancy, totalWeeksInLife } = useBaseContext()

  const { weeksLived, weeksRemaining, percentSpent } = useMemo(() => {
    const totalWeeks = Math.ceil(totalWeeksInLife)
    const weeksLeft = Math.ceil(getWeeksLeft(birthdate, totalWeeksInLife))

    return {
      // Clamped so a birthdate in the future doesn't read as negative, and an
      // outlived expectancy doesn't promise weeks that are already spent.
      weeksLived: Math.max(0, totalWeeks - weeksLeft),
      weeksRemaining: Math.max(0, weeksLeft),
      percentSpent: Math.round(
        (Math.max(0, totalWeeks - weeksLeft) / totalWeeks) * 100
      ),
    }
  }, [birthdate, totalWeeksInLife])

  return (
    <div id='stats' className='ledger'>
      <div className='measure'>
        <span className='measure-value'>{weeksLived.toLocaleString()}</span>
        <span className='measure-label'>weeks lived</span>
      </div>
      <div className='measure'>
        <span className='measure-value'>{weeksRemaining.toLocaleString()}</span>
        <span className='measure-label'>weeks remaining</span>
      </div>
      <div className='measure'>
        <span className='measure-value'>{percentSpent}%</span>
        <span className='measure-label'>of {lifeExpectancy} years spent</span>
      </div>
    </div>
  )
}
