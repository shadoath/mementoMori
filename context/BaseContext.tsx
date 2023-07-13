'use client'
import React, { useEffect, useState } from 'react'
import useLocalStorage from 'use-local-storage'

export type LifeEvent = {
  date: Date
  description: string
  color: string
  icon?: string
}
const defaultBirthdate = new Date('2005-04-29')

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
  totalWeeksInLife: 42 * 52.1429,
  setBirthdate: () => {},
  setLifeExpectancy: () => {},
  setLifeEvents: () => {},
})
const birthdateOptions = {
  serializer: (obj: any): string => {
    /* Serialize logic */
    console.log(obj, typeof obj)
    return obj.toISOString().split('T')[0]
  },
  parser: (str: any): Date => {
    /* Parse logic */
    console.log(str, typeof str)
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

  console.log(birthdate)
  // const [birthdate, setBirthdate] = useState(new Date(birthdateString))
  const [lifeExpectancy, setLifeExpectancy] = useLocalStorage(
    'lifeExpectancy',
    42
  )
  const [lifeEvents, setLifeEvents] = useState<LifeEvent[]>([])
  const totalWeeksInLife = myLifeExpectancy * 52.1429

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
