'use client'
import { usePathname, useRouter } from "next/navigation"
import useUser from "@/data/hooks/useUser"

const UserForce = (props: any) => {
  const { loading, user } = useUser()
  const path = usePathname()
  const router = useRouter()

  function redirect(url: string) {
    router.push(url)
    return (
      <div className="flex justify-center items-center h-screen">
        Direcionando...
      </div>
    )
  }

  if (!user?.email && loading) return <div>Carregando...</div>
  if (!user?.email) return redirect(`/enter?destiny=${path}`)

  return props.children
}

export default UserForce
