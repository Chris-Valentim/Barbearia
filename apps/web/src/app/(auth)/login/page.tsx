'use client'
import { Suspense } from "react"
import UserForm from '@/components/features/user/UserForm'

const Page = () => {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <UserForm />
    </Suspense>
  )
}

export default Page
