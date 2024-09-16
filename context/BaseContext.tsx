import React, { useState } from 'react'
import useLocalStorage from 'use-local-storage'

export type LifeEvent = {
  date: Date
  description: string
  color: string
  icon?: string
}
export const defaultBirthdate = new Date('2005-04-29')

export const WEEKS_PER_YEAR = 52.1429
const BaseContext = React.createContext<{
  birthdate: Date
  lifeExpectancy: number
  lifeEvents: LifeEvent[]
  totalWeeksInLife: number
  setBirthdate: (date: Date) => void
  setLifeExpectancy: (years: number) => void
  setLifeEvents: (events: LifeEvent[]) => void
}>({
  birthdate: defaultBirthdate,
  lifeExpectancy: 42,
  lifeEvents: [],
  totalWeeksInLife: 42 * WEEKS_PER_YEAR,
  setBirthdate: () => {},
  setLifeExpectancy: () => {},
  setLifeEvents: () => {},
})

const birthdateOptions = {
  serializer: (obj: any): string => {
    return obj.toISOString().split('T')[0]
  },
  parser: (str: any): Date => {
    return new Date(str)
  },
}
const BaseContextProvider = ({ children }: { children: React.ReactNode }) => {
  const myLifeExpectancy = 42
  const [birthdate, setBirthdate] = useLocalStorage<Date>(
    'birthdate',
    defaultBirthdate,
    birthdateOptions
  )

  const [lifeExpectancy, setLifeExpectancy] = useLocalStorage(
    'lifeExpectancy',
    42
  )
  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>([])
  const totalWeeksInLife = myLifeExpectancy * WEEKS_PER_YEAR

  return (
    <BaseContext.Provider
      value={{
        birthdate,
        lifeExpectancy,
        lifeEvents,
        totalWeeksInLife,
        setBirthdate,
        setLifeExpectancy,
        setLifeEvents,
      }}
    >
      {children}
    </BaseContext.Provider>
  )
}

const useBaseContext = () => {
  const context = React.useContext(BaseContext)

  if (context === undefined) {
    throw new Error('Not in context provider')
  }

  return context
}

export { BaseContext, BaseContextProvider, useBaseContext }
