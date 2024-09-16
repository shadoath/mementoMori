import { useBaseContext } from '../../context/BaseContext'
import { getWeeksLeft } from '../../app/functions'
import { useMemo } from 'react'

export const Stats = () => {
  const { birthdate, lifeExpectancy } = useBaseContext()
  const totalWeeksInLife = lifeExpectancy * 52 // Calculate total weeks in life based on life expectancy

  const { percentOfLifeLived, weeksLeft } = useMemo(() => {
    console.log('stats', { birthdate, totalWeeksInLife })
    const weeksLeft = getWeeksLeft(birthdate, totalWeeksInLife)
    const weeksLived = totalWeeksInLife - weeksLeft
    const percentOfLifeLived = Math.round((weeksLived / totalWeeksInLife) * 100)
    console.log('stats', {
      birthdate,
      totalWeeksInLife,
      percentOfLifeLived,
      weeksLeft,
    })
    return { percentOfLifeLived, weeksLeft }
  }, [birthdate, totalWeeksInLife])

  return (
    <div id='stats' className='stats wrapper'>
      {weeksLeft !== null &&
        `${
          Math.ceil(totalWeeksInLife) - Math.ceil(weeksLeft)
        } weeks lived of ${Math.ceil(totalWeeksInLife)} total weeks`}
      <br />
      {percentOfLifeLived}% of {lifeExpectancy} years lived.
    </div>
  )
}
