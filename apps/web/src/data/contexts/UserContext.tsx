'use client'
import { createContext, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@barba/contracts'
import useLocalStorage from '../hooks/useLocalStorage'

export interface UserContextProps {
  loading: boolean
  user: User | null
  singIn: (user: User) => Promise<void>
  getOut: () => void
}

const UserContext = createContext<UserContextProps>({} as any)

export const UserTaster = ({ children }: any) => {
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

  async function singIn(user: User) {
    setUser(user)
    set('user', user)
  }

  function getOut() {
    router.push('/')
    setUser(null)
    set('user', null)
  }

  useEffect(() => userLoaded(), [userLoaded])

  return (
    <UserContext.Provider
      value={{
        loading,
        user,
        singIn,
        getOut
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserContext
