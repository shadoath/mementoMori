export const WEEKS_PER_YEAR = 52.1429
export const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000

/** Each month is drawn as four squares, so a "week" here is a quarter-month. */
export const SQUARES_PER_MONTH = 4

export const isValidDate = (date: Date) => !Number.isNaN(date.getTime())

/** `month` is 1-indexed. */
export const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month, 0).getDate()
}

/**
 * The last day covered by square `square` (0-3) of a month. A square counts as
 * lived once this day has passed, which is what makes the four squares fill one
 * at a time rather than all at once.
 */
export const getSquareEndDate = (
  year: number,
  monthIndex: number,
  square: number
) => {
  const daysPerSquare = getDaysInMonth(monthIndex + 1, year) / SQUARES_PER_MONTH
  return new Date(year, monthIndex, Math.floor((square + 1) * daysPerSquare))
}

export const getWeekId = (year: number, monthIndex: number, square: number) =>
  `${year}-${monthIndex + 1}-${square + 1}`

/**
 * Which square of the grid a date lands in. Defined against
 * {@link getSquareEndDate} rather than recomputing the boundaries, so the two
 * can't drift apart and strand an event on the wrong square.
 */
export const getWeekIdFromDate = (date: Date) => {
  const year = date.getFullYear()
  const monthIndex = date.getMonth()
  const day = date.getDate()

  for (let square = 0; square < SQUARES_PER_MONTH - 1; square++) {
    if (day <= getSquareEndDate(year, monthIndex, square).getDate()) {
      return getWeekId(year, monthIndex, square)
    }
  }

  return getWeekId(year, monthIndex, SQUARES_PER_MONTH - 1)
}

export const getWeeksLeft = (
  birthdate: Date,
  totalWeeksInLife: number,
  now = Date.now()
) => {
  // Negative when the birthdate is in the future.
  const ageInMs = now - birthdate.getTime()

  return Math.ceil(totalWeeksInLife - ageInMs / MS_PER_WEEK)
}

const pad = (value: number) => String(value).padStart(2, '0')

/**
 * `<input type="date">` and localStorage both speak YYYY-MM-DD. Going through
 * `toISOString` instead would shift the day by one either side of UTC, which
 * lands life events on the wrong square.
 */
export const formatDateInput = (date: Date) =>
  `${String(date.getFullYear()).padStart(4, '0')}-${pad(
    date.getMonth() + 1
  )}-${pad(date.getDate())}`

/** Returns null for partial or nonsense input, e.g. a cleared date field. */
export const parseDateInput = (value: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) {
    return null
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])

  // setFullYear rather than the Date constructor, which reads a year under 100
  // as 19xx — a half-typed "0002" would otherwise become 1902.
  const date = new Date(0)
  date.setFullYear(year, month - 1, day)
  date.setHours(0, 0, 0, 0)

  // Rejects overflow like 2023-02-31, which Date rolls forward into March.
  if (
    !isValidDate(date) ||
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }

  return date
}
