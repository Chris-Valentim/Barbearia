'use client'
import { UserTaster } from '@/data/contexts/UserContext'

const layout = ({ children }: any) => {
  return (
    <UserTaster>
      {children}
    </UserTaster>
  )
}

export default layout