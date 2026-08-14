import { act, render } from '@testing-library/react'
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

  it('waits for a square to be fully over before filling it', () => {
    // The first square closes on the 7th, so it is only lived from the 8th.
    vi.setSystemTime(new Date(2000, 0, 7, 23, 59))
    const { unmount } = renderCalendar()
    expect(document.getElementById('2000-1-1')).not.toHaveClass('filled')
    unmount()

    vi.setSystemTime(new Date(2000, 0, 8, 0, 1))
    renderCalendar()
    expect(document.getElementById('2000-1-1')).toHaveClass('filled')
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

  it('marks pre-birth squares both filled and invisible', () => {
    // Squares before the birthdate carry `filled` too, because their end date
    // has passed. globals.css must therefore exclude `.invisible` from the
    // fill rule, or the blank pre-birth run renders as lived weeks. jsdom
    // doesn't apply the stylesheet, so this pins the class pairing the CSS
    // depends on; the rendered result is checked in the browser.
    vi.setSystemTime(new Date(2020, 0, 10, 12))
    window.localStorage.setItem('birthdate', '2000-06-15')
    renderCalendar()

    const preBirth = document.getElementById('2000-1-1')
    expect(preBirth).toHaveClass('filled')
    expect(preBirth).toHaveClass('invisible')
  })

  it('marks weeks lived beyond the life expectancy as extra', () => {
    vi.setSystemTime(new Date(2011, 0, 10, 12))
    window.localStorage.setItem('lifeExpectancy', '10')
    renderCalendar()

    expect(document.getElementById('2009-6-1')).not.toHaveClass('extra')
    expect(document.getElementById('2010-6-1')).toHaveClass('extra')
    expect(document.getElementById('2010-6-1')).toHaveClass('filled')
  })

  it('marks the week you are actually in, and only that one', () => {
    // The 10th falls in January's second square, which closes on the 15th.
    vi.setSystemTime(new Date(2000, 0, 10, 12))
    const { container } = renderCalendar()

    expect(container.querySelectorAll('.current')).toHaveLength(1)
    expect(document.getElementById('2000-1-2')).toHaveClass('current')
    expect(document.getElementById('2000-1-2')).toHaveAttribute(
      'data-tooltip',
      'This week'
    )
  })

  it('groups the years into decades with an age in the margin', () => {
    vi.setSystemTime(new Date(2020, 0, 10, 12))
    window.localStorage.setItem('lifeExpectancy', '42')
    const { container } = renderCalendar()

    // 43 year blocks over 10-year rows.
    const decades = container.querySelectorAll('.decade')
    expect(decades).toHaveLength(5)
    expect(
      Array.from(container.querySelectorAll('.decade-age')).map(
        (el) => el.textContent
      )
    ).toEqual(['0', '10', '20', '30', '40'])
    expect(
      Array.from(container.querySelectorAll('.decade-year')).map(
        (el) => el.textContent
      )
    ).toEqual(['2000', '2010', '2020', '2030', '2040'])
  })

  it('renders a block for every year of life, plus the partial final one', () => {
    vi.setSystemTime(new Date(2020, 0, 10, 12))
    window.localStorage.setItem('lifeExpectancy', '42')
    const { container } = renderCalendar()

    expect(container.querySelectorAll('.year-cell')).toHaveLength(43)
  })

  it('caps how many year blocks an implausible birthdate can ask for', () => {
    vi.setSystemTime(new Date(2020, 0, 10, 12))
    window.localStorage.setItem('birthdate', '0002-01-01')
    const { container } = renderCalendar()

    expect(container.querySelectorAll('.year-cell')).toHaveLength(112)
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

  it('keeps an event visible when it lands in the current week', () => {
    vi.setSystemTime(new Date(2020, 0, 10, 12))
    window.localStorage.setItem(
      'lifeEvents',
      JSON.stringify([
        { date: '2020-01-10', description: 'Today', color: '#00ff00' },
      ])
    )
    renderCalendar()

    const cell = document.getElementById('2020-1-2')
    expect(cell).toHaveClass('current')
    // The event keeps its own colour; the rubric ring still marks the week.
    expect(cell?.getAttribute('style')).toContain('rgb(0, 255, 0)')
    expect(cell).toHaveAttribute('data-tooltip', 'This week · Today')
  })

  it('gives a marked square an accessible name, not just a silent tab stop', () => {
    vi.setSystemTime(new Date(2020, 0, 10, 12))
    window.localStorage.setItem(
      'lifeEvents',
      JSON.stringify([
        { date: '2000-05-14', description: 'Something', color: '#ff0000' },
      ])
    )
    renderCalendar()

    const cell = document.getElementById('2000-5-2')
    expect(cell).toHaveAttribute('tabindex', '0')
    expect(cell).toHaveAttribute('role', 'img')
    expect(cell).toHaveAccessibleName('Something')

    // Unmarked squares stay out of the tab order entirely.
    const plain = document.getElementById('2000-5-1')
    expect(plain).not.toHaveAttribute('tabindex')
    expect(plain).not.toHaveAttribute('role')
  })

  it('does not paint an event onto a square before the birthdate', () => {
    vi.setSystemTime(new Date(2020, 0, 10, 12))
    window.localStorage.setItem('birthdate', '2000-06-15')
    window.localStorage.setItem(
      'lifeEvents',
      JSON.stringify([
        { date: '2000-03-01', description: 'Too early', color: '#ff0000' },
      ])
    )
    renderCalendar()

    const cell = document.getElementById('2000-3-1')
    expect(cell).toHaveClass('invisible')
    expect(cell).not.toHaveAttribute('data-tooltip')
    expect(cell?.getAttribute('style')).toBeNull()
  })

  it('ignores an event that predates the birthdate but shares its square', () => {
    vi.setSystemTime(new Date(2020, 0, 10, 12))
    // June's second square runs to the 15th, so the birthdate and an event on
    // the 10th land in the same, visible square.
    window.localStorage.setItem('birthdate', '2000-06-15')
    window.localStorage.setItem(
      'lifeEvents',
      JSON.stringify([
        { date: '2000-06-10', description: 'Before I existed', color: '#f00' },
      ])
    )
    renderCalendar()

    const cell = document.getElementById('2000-6-2')
    expect(cell).not.toHaveClass('invisible')
    expect(cell).not.toHaveAttribute('data-tooltip')
    expect(cell?.getAttribute('style')).toBeNull()
  })

  it('drops stored events whose fields are not strings', () => {
    vi.setSystemTime(new Date(2020, 0, 10, 12))
    window.localStorage.setItem(
      'lifeEvents',
      JSON.stringify([
        { date: '2010-06-15', description: {}, color: '#f00' },
        { date: '2010-07-15', description: 'Fine', color: '#0f0' },
      ])
    )

    expect(() => renderCalendar()).not.toThrow()
    expect(document.getElementById('2010-7-2')).toHaveAttribute(
      'data-tooltip',
      'Fine'
    )
  })

  it('survives another tab clearing localStorage', () => {
    vi.setSystemTime(new Date(2020, 0, 10, 12))
    const { container } = renderCalendar()

    // useLocalStorage's storage listener hands back undefined for a cleared
    // key, whatever its type parameter says.
    expect(() => {
      act(() => {
        for (const key of ['birthdate', 'lifeEvents']) {
          window.dispatchEvent(
            new StorageEvent('storage', {
              key,
              newValue: null,
              storageArea: window.localStorage,
            })
          )
        }
      })
    }).not.toThrow()

    // Falls back to the default birthdate rather than blowing up.
    expect(container.querySelectorAll('.year-cell').length).toBeGreaterThan(0)
    expect(document.getElementById('2005-5-1')).toBeTruthy()
  })
})
