'use client'
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { UsefulPhone } from "@barba/core"
import useUser from "@/data/hooks/useUser"
import Logo from "../shared/Logo"
import Image from "next/image"

const UserForm = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const { user, enter } = useUser()
  const params = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (user?.email) {
      const dest = params.get('destiny') as string
      router.push(dest ? dest : '/')
    }
  }, [user, router, params])


  return (
    <div className="flex justify-center items-center h-screen relative">
      <Image
        src='/banners/principal.webp'
        fill
        alt="Barbearia"
        className="object-cover"
      />
      <div
        className="
          flex flex-col justify-center items-center gap-10 absolute top-0 left-0 w-full h-full bg-black/80 md:bg-transparent md:bg-gradient-to-r from-black/30 via-black/90 to-black/30
        "
      >
        <Logo />
        <div className="flex flex-col w-1/5 gap-5">
          <div className="flex flex-col gap-4 rounded">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome"
              className="bg-zinc-900 px-4 py-2 rounded"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              className="bg-zinc-900 px-4 py-2 rounded"
            />
            <input
              type="tel"
              value={UsefulPhone.format(phone)}
              onChange={(s) => setPhone(s.target.value)}
              placeholder="Telefone"
              className="bg-zinc-900 px-4 py-2 rounded"
            />
            <div className="flex gap-5">
              <button onClick={() => enter({ name, email, phone })} className="button bg-green-600 flex-1">
                Entrar
              </button>
              <button onClick={() => {
                router.push('/')
              }} className="button flex-1">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserForm
