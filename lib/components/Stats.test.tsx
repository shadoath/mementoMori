import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MS_PER_WEEK } from '../../app/functions'
import { BaseContextProvider } from '../../context/BaseContext'
import { Stats } from './Stats'

const birthdate = new Date(2000, 0, 1)

const renderStats = () =>
  render(
    <BaseContextProvider>
      <Stats />
    </BaseContextProvider>
  )

describe('Stats', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    window.localStorage.setItem('birthdate', '2000-01-01')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('counts weeks against the same 52.1429 weeks/year the grid uses', () => {
    vi.setSystemTime(birthdate.getTime() + 100 * MS_PER_WEEK)
    const { container } = renderStats()
    const text = container.textContent ?? ''

    // 42 * 52.1429 = 2190.0018, rounded up to 2191.
    expect(text).toContain('100')
    expect(text).toContain('weeks lived')
    expect(text).toContain('2,091')
    expect(text).toContain('weeks remaining')
    expect(text).toContain('5%')
    expect(text).toContain('of 42 years spent')
  })

  it('never reports negative weeks for a birthdate in the future', () => {
    vi.setSystemTime(birthdate.getTime() - 50 * MS_PER_WEEK)
    const { container } = renderStats()
    const text = container.textContent ?? ''

    expect(text).toContain('0%')
    expect(text).toContain('2,241')
    expect(text).not.toContain('-')
  })

  it('never promises remaining weeks once the expectancy is outlived', () => {
    window.localStorage.setItem('lifeExpectancy', '10')
    vi.setSystemTime(birthdate.getTime() + 700 * MS_PER_WEEK)
    const { container } = renderStats()
    const text = container.textContent ?? ''

    // 10 * 52.1429 = 522, so 700 weeks in there is nothing left to spend.
    expect(text).toContain('700')
    expect(text).toContain('0weeks remaining')
    expect(text).not.toContain('-')
  })

  it('tracks the configured life expectancy', () => {
    window.localStorage.setItem('lifeExpectancy', '80')
    vi.setSystemTime(birthdate.getTime() + 100 * MS_PER_WEEK)
    const { container } = renderStats()

    // 80 * 52.1429 = 4171.432, rounded up to 4172.
    expect(container.textContent).toContain('4,072')
    expect(container.textContent).toContain('of 80 years spent')
  })
})
