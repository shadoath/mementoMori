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

  it('counts weeks lived against the same 52.1429 weeks/year the grid uses', () => {
    vi.setSystemTime(birthdate.getTime() + 100 * MS_PER_WEEK)
    const { container } = renderStats()

    // 42 * 52.1429 = 2190.0018, rounded up.
    expect(container.textContent).toContain('100 weeks lived of 2191 total weeks')
    expect(container.textContent).toContain('5% of 42 years lived.')
  })

  it('never reports negative weeks for a birthdate in the future', () => {
    vi.setSystemTime(birthdate.getTime() - 50 * MS_PER_WEEK)
    const { container } = renderStats()

    expect(container.textContent).toContain('0 weeks lived of 2191 total weeks')
    expect(container.textContent).toContain('0% of 42 years lived.')
  })

  it('tracks the configured life expectancy', () => {
    window.localStorage.setItem('lifeExpectancy', '80')
    vi.setSystemTime(birthdate.getTime() + 100 * MS_PER_WEEK)
    const { container } = renderStats()

    // 80 * 52.1429 = 4171.432, rounded up.
    expect(container.textContent).toContain('100 weeks lived of 4172 total weeks')
    expect(container.textContent).toContain('of 80 years lived.')
  })
})
