'use client'
import { createContext, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@barba/contracts'
import useLocalStorage from '../hooks/useLocalStorage'

export interface UserContextProps {
  loading: boolean
  user: User | null
  signIn: (user: User) => Promise<void>
  signOut: () => void
}

const UserContext = createContext<UserContextProps>({} as any)

export const UserProvider = ({ children }: any) => {
  const { get, set } = useLocalStorage()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  const userLoaded = useCallback(
    function () {
      try {
        const userLocal = get('user')
        if (userLocal) {
          setUser(userLocal)
        }
      } finally {
        setLoading(false)
      }
    },
    [get]
  )

  async function signIn(user: User) {
    setUser(user)
    set('user', user)
  }

  function signOut() {
    // A ordem importa: limpar a sessão antes de navegar. Com o push primeiro,
    // o RequireUser da rota privada ainda enxergava o usuário como ausente e
    // corria para /login?destiny=<rota privada>, e o logout terminava na tela
    // de login em vez da home.
    setUser(null)
    set('user', null)
    router.replace('/')
  }

  useEffect(() => userLoaded(), [userLoaded])

  return (
    <UserContext.Provider
      value={{
        loading,
        user,
        signIn,
        signOut
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserContext
