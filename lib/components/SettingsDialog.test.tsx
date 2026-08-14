import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { BaseContextProvider } from '../../context/BaseContext'
import { EventList } from './LifeEvents'
import { SettingsDialog } from './SettingsDialog'
import { Stats } from './Stats'

const renderSettings = () =>
  render(
    <BaseContextProvider>
      <Stats />
      <EventList />
      <SettingsDialog />
    </BaseContextProvider>
  )

const openDialog = () => {
  fireEvent.click(screen.getByLabelText('Settings'))
}

describe('SettingsDialog', () => {
  beforeEach(() => {
    window.localStorage.setItem('birthdate', '2000-01-01')
  })

  it('opens itself only when no birthdate has been stored yet', () => {
    window.localStorage.clear()
    renderSettings()

    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByLabelText('Birthdate')).toBeInTheDocument()
  })

  it('shows the birthdate as YYYY-MM-DD', () => {
    renderSettings()
    openDialog()

    expect(screen.getByLabelText('Birthdate')).toHaveValue('2000-01-01')
  })

  it('survives the birthdate field being cleared', () => {
    const { container } = renderSettings()
    openDialog()
    const input = screen.getByLabelText('Birthdate')

    expect(() => {
      fireEvent.change(input, { target: { value: '' } })
    }).not.toThrow()

    // The draft empties, but nothing invalid reaches the calendar.
    expect(input).toHaveValue('')
    expect(container.textContent).not.toContain('NaN')

    // Leaving the field restores the last date that actually parsed.
    fireEvent.blur(input)
    expect(input).toHaveValue('2000-01-01')
  })

  it('keeps a half-typed birthdate out of the calendar until it parses', () => {
    const { container } = renderSettings()
    openDialog()
    const input = screen.getByLabelText('Birthdate')

    fireEvent.change(input, { target: { value: '1993-05' } })
    expect(input).toHaveValue('1993-05')
    // Still showing the committed 2000-01-01 birthdate, not a partial one.
    expect(container.textContent).not.toContain('NaN')

    fireEvent.change(input, { target: { value: '0002-01-01' } })
    expect(input).toHaveValue('0002-01-01')
  })

  it('leaves the text alone while it is being typed', () => {
    renderSettings()
    openDialog()
    const input = screen.getByLabelText('Birthdate')

    // No reformatting mid-edit: that is what corrupted segments and moved
    // the caret. What you type is what you see.
    for (const value of ['1993-5-4', '2000--01', '19851231', '2001-3-7']) {
      fireEvent.change(input, { target: { value } })
      expect(input).toHaveValue(value)
    }
  })

  it('tidies bare digits and single-digit segments when the field is left', () => {
    renderSettings()
    openDialog()
    const input = screen.getByLabelText('Birthdate')

    for (const [typed, tidied] of [
      ['19851231', '1985-12-31'],
      ['2001-3-7', '2001-03-07'],
      ['1993-5-14', '1993-05-14'],
    ]) {
      fireEvent.change(input, { target: { value: typed } })
      fireEvent.blur(input)
      expect(input).toHaveValue(tidied)
    }
  })

  it('does not save the valid prefix of an invalid entry', () => {
    const { container } = renderSettings()
    openDialog()
    const input = screen.getByLabelText('Birthdate')

    // 1993-05-14 is a valid prefix of this; committing per keystroke would
    // have saved it on the way past.
    fireEvent.change(input, { target: { value: '1993-05-141' } })
    fireEvent.blur(input)

    expect(input).toHaveValue('1993-05-141')
    expect(screen.getByText('Use YYYY-MM-DD')).toBeInTheDocument()
    // Still the birthdate it started with: 2000-01-01 with a 42 year span.
    expect(container.textContent).toContain('of 42 years spent')
    expect(window.localStorage.getItem('birthdate')).toBe('2000-01-01')
  })

  it('keeps an impossible date on screen instead of silently reverting', () => {
    renderSettings()
    openDialog()
    const input = screen.getByLabelText('Birthdate')

    fireEvent.change(input, { target: { value: '2023-02-31' } })
    expect(input).toHaveValue('2023-02-31')

    fireEvent.blur(input)
    // February 31st is not accepted, but the entry stays visible with an
    // error rather than snapping back with no explanation.
    expect(input).toHaveValue('2023-02-31')
    expect(screen.getByText('Use YYYY-MM-DD')).toBeInTheDocument()
  })

  it('clamps the life expectancy to the allowed range', () => {
    const { container } = renderSettings()
    openDialog()
    const input = screen.getByLabelText('Life expectancy')

    fireEvent.change(input, { target: { value: '999' } })
    expect(container.textContent).toContain('of 111 years spent')

    fireEvent.change(input, { target: { value: '0' } })
    expect(container.textContent).toContain('of 1 years spent')

    fireEvent.blur(input)
    expect(input).toHaveValue(1)
  })

  it('leaves the life expectancy alone while the field is empty', () => {
    const { container } = renderSettings()
    openDialog()
    const input = screen.getByLabelText('Life expectancy')

    fireEvent.change(input, { target: { value: '' } })

    expect(container.textContent).toContain('of 42 years spent')
    expect(container.textContent).not.toContain('NaN')
  })

  it('adds and removes life events', () => {
    renderSettings()
    openDialog()

    fireEvent.change(screen.getByLabelText('Date'), {
      target: { value: '2010-06-15' },
    })
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Moved house' },
    })
    fireEvent.click(screen.getByText('Add event'))

    expect(screen.getAllByText('Moved house').length).toBeGreaterThan(0)
    expect(window.localStorage.getItem('lifeEvents')).toContain('2010-06-15')

    fireEvent.click(screen.getByLabelText('Remove Moved house'))
    expect(screen.queryByText('Moved house')).not.toBeInTheDocument()
  })

  it('flags events that fall outside the drawn calendar', () => {
    window.localStorage.setItem(
      'lifeEvents',
      JSON.stringify([
        { date: '1975-01-01', description: 'Before my time', color: '#ff0000' },
        { date: '2010-06-15', description: 'Within range', color: '#00ff00' },
      ])
    )
    renderSettings()

    const before = screen.getByText('Before my time').closest('li')
    const within = screen.getByText('Within range').closest('li')

    expect(before).toHaveClass('life-event-off-calendar')
    expect(before?.textContent).toContain('outside the calendar')
    expect(within).not.toHaveClass('life-event-off-calendar')
    expect(within?.textContent).not.toContain('outside the calendar')
  })

  it('will not add an event without a date and a description', () => {
    renderSettings()
    openDialog()

    expect(screen.getByText('Add event').closest('button')).toBeDisabled()

    fireEvent.change(screen.getByLabelText('Date'), {
      target: { value: '2010-06-15' },
    })
    expect(screen.getByText('Add event').closest('button')).toBeDisabled()

    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Moved house' },
    })
    expect(screen.getByText('Add event').closest('button')).toBeEnabled()
  })
})
