import { useEffect, useState } from 'react'

/**
 * The server has no localStorage, so anything derived from saved settings would
 * render one way on the server and another on the client. Holding those parts
 * back until after mount avoids the mismatch; everything that doesn't depend on
 * saved settings should stay outside the gate so it still renders server-side.
 */
export const HydrationGate = ({ children }: { children: React.ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return <>{isHydrated ? children : null}</>
}
