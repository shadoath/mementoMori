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

  it('survives the birthdate field being cleared', () => {
    renderSettings()
    openDialog()
    const input = screen.getByLabelText('Birthdate')

    expect(() => {
      fireEvent.change(input, { target: { value: '' } })
    }).not.toThrow()

    // The last valid date is kept rather than becoming an Invalid Date.
    expect(input).toHaveValue('2000-01-01')
  })

  it('ignores a partially typed birthdate', () => {
    renderSettings()
    openDialog()
    const input = screen.getByLabelText('Birthdate')

    fireEvent.change(input, { target: { value: '0002-01-01' } })
    expect(input).toHaveValue('0002-01-01')

    fireEvent.change(input, { target: { value: '' } })
    expect(input).toHaveValue('0002-01-01')
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
