export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate()
}

export const getWeekIdFromDate = (date: Date) => {
  let n_days = getDaysInMonth(date.getMonth() + 1, date.getFullYear())
  let week_number = Math.floor((date.getDate() - 1) / (n_days / 4))
  return `${date.getFullYear()}-${date.getMonth() + 1}-${week_number + 1}`
}

export const getWeeksLeft = (birthdate: Date, totalWeeksInLife: number) => {
  const ageDifMs = Date.now() - birthdate.getTime()

  return Math.ceil(totalWeeksInLife - ageDifMs / (1000 * 60 * 60 * 24 * 7))
}
