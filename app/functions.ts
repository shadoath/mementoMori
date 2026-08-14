export const WEEKS_PER_YEAR = 52.1429
export const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000

/** Each month is drawn as four squares, so a "week" here is a quarter-month. */
export const SQUARES_PER_MONTH = 4

export const isValidDate = (date: Date) => !Number.isNaN(date.getTime())

/**
 * Local midnight for a year/month/day, avoiding the Date constructor's habit of
 * reading a year under 100 as 19xx — which would quietly turn a birth year of
 * 0002 into 1902 and mark the first century of the calendar as lived.
 */
const localDate = (year: number, monthIndex: number, day: number) => {
  const date = new Date(0)
  date.setFullYear(year, monthIndex, day)
  date.setHours(0, 0, 0, 0)
  return date
}

/** Midnight local time, so day-granularity comparisons ignore the clock. */
export const startOfDay = (date: Date) =>
  localDate(date.getFullYear(), date.getMonth(), date.getDate())

/** `month` is 1-indexed. */
export const getDaysInMonth = (month: number, year: number) => {
  return localDate(year, month, 0).getDate()
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
  return localDate(year, monthIndex, Math.floor((square + 1) * daysPerSquare))
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

/**
 * How many year blocks the calendar draws past the birth year. Capped, because
 * a half-typed year like 0002 would otherwise ask for ~2,000 blocks of 48
 * cells each and lock up the page.
 */
export const getYearsToDisplay = (
  birthdate: Date,
  lifeExpectancy: number,
  maxYears: number,
  now = new Date()
) => {
  const yearsAlive = now.getFullYear() - birthdate.getFullYear()
  return Math.min(maxYears, Math.max(lifeExpectancy, yearsAlive))
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
  const date = localDate(year, month - 1, day)

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
