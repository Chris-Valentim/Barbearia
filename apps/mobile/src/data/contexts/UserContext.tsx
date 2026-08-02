import { createContext, useCallback, useEffect, useState } from 'react'
import { User } from '@barba/contracts'
import useStorage from '../hooks/useStorage'

export interface UserContextProps {
  loading: boolean
  user: User | null
  signIn: (user: User) => Promise<void>
  signOut: () => Promise<void>
}

const UserContext = createContext<UserContextProps>({} as any)

export const UserProvider = ({ children }: any) => {
  const { get, set } = useStorage()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  const userLoaded = useCallback(
    async function () {
      try {
        const userLocal = await get('user')
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
    await set('user', user)
  }

  async function signOut() {
    setUser(null)
    await set('user', null)
  }

  useEffect(() => {
    userLoaded()
  }, [userLoaded])

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
