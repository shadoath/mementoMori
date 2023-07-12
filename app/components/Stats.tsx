export const Stats = ({
  weeksLeft,
  totalWeeksInLife,
  lifeExpectancy,
}: {
  weeksLeft: number
  totalWeeksInLife: number
  lifeExpectancy: number
}) => {
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
