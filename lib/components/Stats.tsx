import { useBaseContext } from '../../context/BaseContext'
import { getWeeksLeft } from '../../app/functions'

export const Stats = () => {
  const { birthdate, lifeExpectancy, totalWeeksInLife } = useBaseContext()
  const weeksLeft = getWeeksLeft(birthdate, totalWeeksInLife)
  const percentOfLifeLived = Math.round(
    ((Math.ceil(totalWeeksInLife) - Math.ceil(weeksLeft)) /
      Math.ceil(totalWeeksInLife)) *
      100
  )
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
