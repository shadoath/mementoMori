import { useMemo } from 'react'
import { getWeeksLeft } from '../../app/functions'
import { useBaseContext } from '../../context/BaseContext'

export const Stats = () => {
  const { birthdate, lifeExpectancy, totalWeeksInLife } = useBaseContext()

  const { totalWeeks, weeksLived, percentOfLifeLived } = useMemo(() => {
    const totalWeeks = Math.ceil(totalWeeksInLife)
    const weeksLeft = Math.ceil(getWeeksLeft(birthdate, totalWeeksInLife))
    // Clamped at zero so a birthdate in the future doesn't read as negative.
    const weeksLived = Math.max(0, totalWeeks - weeksLeft)

    return {
      totalWeeks,
      weeksLived,
      percentOfLifeLived: Math.round((weeksLived / totalWeeks) * 100),
    }
  }, [birthdate, totalWeeksInLife])

  return (
    <div id='stats' className='stats wrapper'>
      {weeksLived} weeks lived of {totalWeeks} total weeks
      <br />
      {percentOfLifeLived}% of {lifeExpectancy} years lived.
    </div>
  )
}
