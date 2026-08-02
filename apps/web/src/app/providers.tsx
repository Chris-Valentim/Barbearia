'use client'

import { UserProvider } from '@/data/contexts/UserContext'

/**
 * Fronteira de client component do app. O layout raiz precisa continuar
 * sendo server component (é ele que exporta `metadata`), então os providers
 * que dependem de estado e de hooks do React ficam isolados aqui.
 */
const Providers = ({ children }: { children: React.ReactNode }) => {
  return <UserProvider>{children}</UserProvider>
}

export default Providers
