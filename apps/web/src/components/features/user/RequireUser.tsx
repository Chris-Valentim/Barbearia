'use client'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import useUser from '@/data/hooks/useUser'

const RequireUser = (props: any) => {
  const { loading, user, signingOut } = useUser()
  const path = usePathname()
  const router = useRouter()

  // Durante um logout deliberado a guarda fica desarmada: quem está saindo já
  // tem para onde ir, e mandá-lo para /login?destiny=<rota privada> devolveria
  // o usuário exatamente à página de onde ele pediu para sair.
  const semSessao = !loading && !signingOut && !user?.email

  // A navegação precisa acontecer em efeito, não durante o render. Chamar
  // router.push no corpo do componente atualiza o estado do Router enquanto o
  // React ainda está renderizando, e o push era reemitido a cada re-render em
  // que a sessão continuasse vazia — o UserProvider recria o objeto de value a
  // cada render, então isso acontecia de fato.
  useEffect(() => {
    if (!semSessao) return
    // replace, e não push: o histórico não deve guardar a rota protegida que
    // o usuário não chegou a ver.
    router.replace(`/login?destiny=${encodeURIComponent(path)}`)
  }, [semSessao, path, router])

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Carregando...
      </div>
    )
  }

  if (semSessao) {
    return (
      <div className='flex justify-center items-center h-screen'>
        Direcionando...
      </div>
    )
  }

  return props.children
}

export default RequireUser
