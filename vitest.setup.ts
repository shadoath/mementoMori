// A positive-offset zone: dates built here land on the previous UTC day, which
// is where the old toISOString-based date handling silently shifted by a day.
process.env.TZ = 'Asia/Tokyo'

import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})
