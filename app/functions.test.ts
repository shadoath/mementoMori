import { describe, expect, it } from 'vitest'
import {
  MS_PER_WEEK,
  SQUARES_PER_MONTH,
  formatDateInput,
  getDaysInMonth,
  getSquareEndDate,
  getSquareEndDateForDate,
  getWeekId,
  getWeekIdFromDate,
  getWeeksLeft,
  getYearsToDisplay,
  isValidDate,
  parseDateInput,
  startOfDay,
} from './functions'

describe('getDaysInMonth', () => {
  it('takes a 1-indexed month', () => {
    expect(getDaysInMonth(1, 2023)).toBe(31)
    expect(getDaysInMonth(12, 2023)).toBe(31)
  })

  it('handles leap years', () => {
    expect(getDaysInMonth(2, 2023)).toBe(28)
    expect(getDaysInMonth(2, 2024)).toBe(29)
    expect(getDaysInMonth(2, 2000)).toBe(29)
    expect(getDaysInMonth(2, 1900)).toBe(28)
  })
})

describe('getSquareEndDate', () => {
  it('spreads the four squares across a 31 day month', () => {
    const days = [0, 1, 2, 3].map(
      (square) => getSquareEndDate(2023, 0, square).getDate()
    )
    expect(days).toEqual([7, 15, 23, 31])
  })

  it('spreads the four squares across a 28 day month', () => {
    const days = [0, 1, 2, 3].map(
      (square) => getSquareEndDate(2023, 1, square).getDate()
    )
    expect(days).toEqual([7, 14, 21, 28])
  })

  it('never spills into the next month', () => {
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const last = getSquareEndDate(2024, monthIndex, SQUARES_PER_MONTH - 1)
      expect(last.getMonth()).toBe(monthIndex)
      expect(last.getDate()).toBe(getDaysInMonth(monthIndex + 1, 2024))
    }
  })
})

describe('getWeekIdFromDate', () => {
  it('agrees with the square the calendar draws, for every day of a leap year', () => {
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const daysInMonth = getDaysInMonth(monthIndex + 1, 2024)

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(2024, monthIndex, day)
        const weekId = getWeekIdFromDate(date)
        const square = Number(weekId.split('-')[2]) - 1

        expect(weekId).toBe(getWeekId(2024, monthIndex, square))
        expect(square).toBeGreaterThanOrEqual(0)
        expect(square).toBeLessThan(SQUARES_PER_MONTH)

        // The day must fall inside the square it maps to: at or before that
        // square's end, and after the previous square's end.
        expect(
          getSquareEndDate(2024, monthIndex, square).getDate()
        ).toBeGreaterThanOrEqual(day)
        if (square > 0) {
          expect(
            getSquareEndDate(2024, monthIndex, square - 1).getDate()
          ).toBeLessThan(day)
        }
      }
    }
  })
})

describe('getWeeksLeft', () => {
  const birthdate = new Date(2000, 0, 1)

  it('counts down from the total', () => {
    const now = birthdate.getTime() + 100 * MS_PER_WEEK
    expect(getWeeksLeft(birthdate, 2190, now)).toBe(2090)
  })

  it('returns more than the total when the birthdate is in the future', () => {
    const now = birthdate.getTime() - 10 * MS_PER_WEEK
    expect(getWeeksLeft(birthdate, 2190, now)).toBe(2200)
  })

  it('goes negative once the expectancy is outlived', () => {
    const now = birthdate.getTime() + 2200 * MS_PER_WEEK
    expect(getWeeksLeft(birthdate, 2190, now)).toBe(-10)
  })
})

describe('parseDateInput', () => {
  it('reads the date in local time, not UTC', () => {
    const date = parseDateInput('1993-05-14')
    expect(date).not.toBeNull()
    expect(date?.getFullYear()).toBe(1993)
    expect(date?.getMonth()).toBe(4)
    expect(date?.getDate()).toBe(14)
  })

  it('rejects empty, partial and malformed input', () => {
    expect(parseDateInput('')).toBeNull()
    expect(parseDateInput('1993')).toBeNull()
    expect(parseDateInput('1993-05')).toBeNull()
    expect(parseDateInput('1993-5-14')).toBeNull()
    expect(parseDateInput('not a date')).toBeNull()
  })

  it('rejects days that do not exist in the month', () => {
    expect(parseDateInput('2023-02-31')).toBeNull()
    expect(parseDateInput('2023-02-29')).toBeNull()
    expect(parseDateInput('2024-02-29')).not.toBeNull()
  })
})

describe('formatDateInput', () => {
  it('round-trips through parseDateInput', () => {
    for (const value of ['1993-05-14', '2000-01-01', '2024-02-29', '1999-12-31']) {
      const parsed = parseDateInput(value)
      expect(parsed).not.toBeNull()
      expect(formatDateInput(parsed as Date)).toBe(value)
    }
  })

  it('zero-pads', () => {
    expect(formatDateInput(new Date(2005, 3, 9))).toBe('2005-04-09')
  })
})

describe('getYearsToDisplay', () => {
  const birthdate = new Date(2000, 0, 1)

  it('uses the life expectancy while it is the larger number', () => {
    expect(getYearsToDisplay(birthdate, 42, 111, new Date(2020, 0, 1))).toBe(42)
  })

  it('extends past the life expectancy once outlived', () => {
    expect(getYearsToDisplay(birthdate, 42, 111, new Date(2050, 0, 1))).toBe(50)
  })

  it('caps an implausible birthdate', () => {
    expect(
      getYearsToDisplay(new Date(2, 0, 1), 42, 111, new Date(2020, 0, 1))
    ).toBe(111)
  })
})

describe('getSquareEndDateForDate', () => {
  it('returns the end of the square the date falls in', () => {
    // May has 31 days: squares close on the 7th, 15th, 23rd and 31st.
    expect(getSquareEndDateForDate(new Date(2000, 4, 14)).getDate()).toBe(15)
    expect(getSquareEndDateForDate(new Date(2000, 4, 1)).getDate()).toBe(7)
    expect(getSquareEndDateForDate(new Date(2000, 4, 31)).getDate()).toBe(31)
  })
})

describe('startOfDay', () => {
  it('strips the clock', () => {
    const stripped = startOfDay(new Date(2020, 5, 15, 23, 59, 59))
    expect(stripped.getDate()).toBe(15)
    expect(stripped.getHours()).toBe(0)
    expect(stripped.getMinutes()).toBe(0)
  })
})

describe('isValidDate', () => {
  it('rejects an unparseable date', () => {
    expect(isValidDate(new Date(''))).toBe(false)
    expect(isValidDate(new Date(2000, 0, 1))).toBe(true)
  })
})
