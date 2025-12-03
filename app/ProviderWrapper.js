'use client'

import { SessionProvider } from 'next-auth/react'
import { useState, useEffect } from 'react'

export default function ProviderWrapper({ children }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <>{children}</>
  }

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}