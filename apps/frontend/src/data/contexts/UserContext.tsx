'use client'
import { createContext, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@barba/core'
import useLocalStorage from '../hooks/useLocalStorage'

export interface UserContextProps {
  loading: boolean
  user: User | null
  enter: (user: User) => Promise<void>
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

  async function enter(user: User) {
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
        enter,
        getOut
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserContext
