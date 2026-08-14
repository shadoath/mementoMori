import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BaseContextProvider } from '../../context/BaseContext'
import { Calendar } from './Calendar'

const renderCalendar = () =>
  render(
    <BaseContextProvider>
      <Calendar />
    </BaseContextProvider>
  )

describe('Calendar', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    window.localStorage.setItem('birthdate', '2000-01-01')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('fills one square at a time as the month progresses', () => {
    // January has 31 days, so the four squares close on the 7th, 15th, 23rd
    // and 31st.
    vi.setSystemTime(new Date(2000, 0, 10, 12))
    renderCalendar()

    expect(document.getElementById('2000-1-1')).toHaveClass('filled')
    expect(document.getElementById('2000-1-2')).not.toHaveClass('filled')
    expect(document.getElementById('2000-1-3')).not.toHaveClass('filled')
    expect(document.getElementById('2000-1-4')).not.toHaveClass('filled')
  })

  it('fills the whole month once it has passed', () => {
    vi.setSystemTime(new Date(2000, 1, 1, 12))
    renderCalendar()

    for (const square of [1, 2, 3, 4]) {
      expect(document.getElementById(`2000-1-${square}`)).toHaveClass('filled')
    }
  })

  it('hides squares before the birthdate', () => {
    vi.setSystemTime(new Date(2000, 5, 1, 12))
    window.localStorage.setItem('birthdate', '2000-03-20')
    renderCalendar()

    expect(document.getElementById('2000-1-1')).toHaveClass('invisible')
    expect(document.getElementById('2000-3-2')).toHaveClass('invisible')
    expect(document.getElementById('2000-3-3')).not.toHaveClass('invisible')
    expect(document.getElementById('2000-4-1')).not.toHaveClass('invisible')
  })

  it('marks weeks lived beyond the life expectancy as extra', () => {
    vi.setSystemTime(new Date(2011, 0, 10, 12))
    window.localStorage.setItem('lifeExpectancy', '10')
    renderCalendar()

    expect(document.getElementById('2009-6-1')).not.toHaveClass('extra')
    expect(document.getElementById('2010-6-1')).toHaveClass('extra')
    expect(document.getElementById('2010-6-1')).toHaveClass('filled')
  })

  it('renders a block for every year of life, plus the partial final one', () => {
    vi.setSystemTime(new Date(2020, 0, 10, 12))
    window.localStorage.setItem('lifeExpectancy', '42')
    const { container } = renderCalendar()

    expect(container.querySelectorAll('.year-wrapper')).toHaveLength(43)
  })

  it('caps how many year blocks an implausible birthdate can ask for', () => {
    vi.setSystemTime(new Date(2020, 0, 10, 12))
    window.localStorage.setItem('birthdate', '0002-01-01')
    const { container } = renderCalendar()

    expect(container.querySelectorAll('.year-wrapper')).toHaveLength(112)
  })

  it('places a life event on the square containing its date', () => {
    vi.setSystemTime(new Date(2020, 0, 10, 12))
    window.localStorage.setItem(
      'lifeEvents',
      JSON.stringify([
        { date: '2000-05-14', description: 'Something', color: '#ff0000' },
      ])
    )
    renderCalendar()

    // May has 31 days, so the 14th sits in the second square (8th-15th).
    const cell = document.getElementById('2000-5-2')
    expect(cell).toHaveAttribute('data-tooltip', 'Something')
    expect(document.getElementById('2000-5-1')).not.toHaveAttribute(
      'data-tooltip'
    )
  })
})
