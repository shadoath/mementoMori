'use client'
import React from 'react'

export type LifeEvent = {
  date: Date
  description: string
  color: string
  icon?: string
}

const BaseContext = React.createContext<{
  birthdate: Date
  lifeExpectancy: number
  lifeEvents: LifeEvent[]
  totalWeeksInLife: number
}>({
  birthdate: new Date('2005-04-29'),
  lifeExpectancy: 42,
  lifeEvents: [],
  totalWeeksInLife: 42 * 52.1429,
})

const BaseContextProvider = ({ children }: { children: React.ReactNode }) => {
  const myLifeExpectancy = 42

  const [birthdate, setBirthdate] = React.useState(new Date('2005-04-29'))
  const [lifeExpectancy, setLifeExpectancy] = React.useState(42)
  const [lifeEvents, setLifeEvents] = React.useState<LifeEvent[]>([])

  const totalWeeksInLife = myLifeExpectancy * 52.1429

  return (
    <BaseContext.Provider
      value={{
        birthdate,
        lifeExpectancy,
        lifeEvents,
        totalWeeksInLife,
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
