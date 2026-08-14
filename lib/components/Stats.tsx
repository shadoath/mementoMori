import { useMemo } from 'react'
import { getWeeksLeft } from '../../app/functions'
import { useBaseContext } from '../../context/BaseContext'

export const Stats = () => {
  const { birthdate, lifeExpectancy, totalWeeksInLife } = useBaseContext()

  const { weeksLived, weeksRemaining, percentSpent } = useMemo(() => {
    const totalWeeks = Math.ceil(totalWeeksInLife)
    const weeksLeft = Math.ceil(getWeeksLeft(birthdate, totalWeeksInLife))
    // Clamped at zero so a birthdate in the future doesn't read as negative.
    const lived = Math.max(0, totalWeeks - weeksLeft)

    return {
      weeksLived: lived,
      // Never fewer than none, never more than the grid actually draws.
      weeksRemaining: Math.min(totalWeeks, Math.max(0, weeksLeft)),
      // Deliberately uncapped: outliving the estimate is the one number on
      // this page worth seeing go past 100.
      percentSpent: Math.round((lived / totalWeeks) * 100),
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
