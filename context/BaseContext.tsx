import React, { useCallback, useMemo, useState } from 'react'
import useLocalStorage from 'use-local-storage'
import {
  WEEKS_PER_YEAR,
  formatDateInput,
  isValidDate,
  parseDateInput,
} from '../app/functions'

export type LifeEvent = {
  date: Date
  description: string
  color: string
  icon?: string
}

export const defaultBirthdate = new Date(2005, 3, 29)
export const DEFAULT_LIFE_EXPECTANCY = 42
export const MIN_LIFE_EXPECTANCY = 1
export const MAX_LIFE_EXPECTANCY = 111
export const DEFAULT_EVENT_COLOR = '#8c6f4a'

export { WEEKS_PER_YEAR }

type BaseContextValue = {
  birthdate: Date
  lifeExpectancy: number
  lifeEvents: LifeEvent[]
  totalWeeksInLife: number
  /** True when nothing has been saved yet, i.e. this is a first visit. */
  isFirstVisit: boolean
  setBirthdate: (date: Date) => void
  setLifeExpectancy: (years: number) => void
  setLifeEvents: (events: LifeEvent[]) => void
  addLifeEvent: (event: LifeEvent) => void
  removeLifeEvent: (index: number) => void
}

const BaseContext = React.createContext<BaseContextValue | undefined>(undefined)

const birthdateOptions = {
  serializer: (date: Date | undefined): string =>
    formatDateInput(date && isValidDate(date) ? date : defaultBirthdate),
  parser: (str: string): Date => parseDateInput(str) ?? defaultBirthdate,
}

type StoredLifeEvent = Omit<LifeEvent, 'date'> & { date: string }

const lifeEventsOptions = {
  serializer: (events: LifeEvent[] | undefined): string =>
    JSON.stringify(
      (events ?? [])
        .filter((event) => isValidDate(event.date))
        .map(
          (event): StoredLifeEvent => ({
            ...event,
            date: formatDateInput(event.date),
          })
        )
    ),
  parser: (str: string): LifeEvent[] => {
    try {
      const stored: StoredLifeEvent[] = JSON.parse(str)
      if (!Array.isArray(stored)) {
        return []
      }

      return stored.flatMap((event) => {
        const date = parseDateInput(event?.date)
        return date ? [{ ...event, date }] : []
      })
    } catch {
      // Corrupted or hand-edited localStorage shouldn't take the app down.
      return []
    }
  },
}

const clampLifeExpectancy = (years: number) => {
  if (!Number.isFinite(years)) {
    return DEFAULT_LIFE_EXPECTANCY
  }

  return Math.min(
    MAX_LIFE_EXPECTANCY,
    Math.max(MIN_LIFE_EXPECTANCY, Math.round(years))
  )
}

const BaseContextProvider = ({ children }: { children: React.ReactNode }) => {
  // Read during the first render, before useLocalStorage's mount effect writes
  // its default back and makes every visit look like a returning one.
  const [isFirstVisit] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.localStorage.getItem('birthdate') === null
  )

  const [storedBirthdate, setStoredBirthdate] = useLocalStorage<Date>(
    'birthdate',
    defaultBirthdate,
    birthdateOptions
  )
  const [storedLifeExpectancy, setStoredLifeExpectancy] = useLocalStorage(
    'lifeExpectancy',
    DEFAULT_LIFE_EXPECTANCY
  )
  const [storedLifeEvents, setLifeEvents] = useLocalStorage<LifeEvent[]>(
    'lifeEvents',
    [],
    lifeEventsOptions
  )

  // useLocalStorage's cross-tab sync hands back `undefined` whenever the other
  // tab clears the key, despite what the type parameter claims — so every read
  // has to survive it.
  const birthdate =
    storedBirthdate && isValidDate(storedBirthdate)
      ? storedBirthdate
      : defaultBirthdate
  const lifeExpectancy = clampLifeExpectancy(storedLifeExpectancy)
  const lifeEvents = storedLifeEvents ?? []

  const setBirthdate = useCallback(
    (date: Date) => {
      if (isValidDate(date)) {
        setStoredBirthdate(date)
      }
    },
    [setStoredBirthdate]
  )

  const setLifeExpectancy = useCallback(
    (years: number) => {
      setStoredLifeExpectancy(clampLifeExpectancy(years))
    },
    [setStoredLifeExpectancy]
  )

  const addLifeEvent = useCallback(
    (event: LifeEvent) => {
      setLifeEvents([...lifeEvents, event])
    },
    [lifeEvents, setLifeEvents]
  )

  const removeLifeEvent = useCallback(
    (index: number) => {
      setLifeEvents(lifeEvents.filter((_, i) => i !== index))
    },
    [lifeEvents, setLifeEvents]
  )

  const value = useMemo(
    () => ({
      birthdate,
      lifeExpectancy,
      lifeEvents,
      totalWeeksInLife: lifeExpectancy * WEEKS_PER_YEAR,
      isFirstVisit,
      setBirthdate,
      setLifeExpectancy,
      setLifeEvents,
      addLifeEvent,
      removeLifeEvent,
    }),
    [
      birthdate,
      lifeExpectancy,
      lifeEvents,
      isFirstVisit,
      setBirthdate,
      setLifeExpectancy,
      setLifeEvents,
      addLifeEvent,
      removeLifeEvent,
    ]
  )

  return <BaseContext.Provider value={value}>{children}</BaseContext.Provider>
}

const useBaseContext = () => {
  const context = React.useContext(BaseContext)

  if (context === undefined) {
    throw new Error('Not in context provider')
  }

  return context
}

export { BaseContext, BaseContextProvider, useBaseContext }
