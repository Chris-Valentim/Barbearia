'use client'
import { createContext, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@barba/contracts'
import useLocalStorage from '../hooks/useLocalStorage'

export interface UserContextProps {
  loading: boolean
  user: User | null
  /** Verdadeiro entre o clique em sair e a saída efetiva da rota protegida. */
  signingOut: boolean
  signIn: (user: User) => Promise<void>
  signOut: () => void
}

const UserContext = createContext<UserContextProps>({} as any)

export const UserProvider = ({ children }: any) => {
  const { get, set } = useLocalStorage()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [signingOut, setSigningOut] = useState(false)

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
    setSigningOut(false)
    setUser(user)
    set('user', user)
  }

  function signOut() {
    // `signingOut` existe para desarmar a guarda de rota durante a saída.
    // Sem isso, limpar a sessão faz o RequireUser da rota privada disparar seu
    // próprio redirecionamento para /login?destiny=<rota privada>, que corre
    // com o replace('/') daqui — e o usuário que pediu para sair terminava
    // numa tela de login apontando de volta para a página de onde saiu.
    setSigningOut(true)
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
        signingOut,
        signIn,
        signOut
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserContext
