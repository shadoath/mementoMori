'use client'

import { BaseContextProvider } from '../context/BaseContext'
import { MementoMori } from '../lib'

const MementoMoriPage = () => {
  return (
    <BaseContextProvider>
      <MementoMori />
    </BaseContextProvider>
  )
}

export default MementoMoriPage
