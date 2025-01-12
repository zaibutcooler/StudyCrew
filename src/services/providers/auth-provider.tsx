'use client'

import { SessionProvider } from 'next-auth/react'
import { FC, PropsWithChildren } from 'react'

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>
}

export default AuthProvider
