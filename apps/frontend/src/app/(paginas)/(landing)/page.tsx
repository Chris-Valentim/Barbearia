'use client'

import OurClients from "@/components/client/OurClients"
import TitleSlogan from "@/components/landing/TitleSlogan"
import OurProfessionals from '@/components/profissional/OurProfessionals'
import OurServices from "@/components/service/OurServices"
import ContainerWithBackground from "@/components/shared/ContainerWithBackground"

const Landing = () => {
  return (
    <div>
      <TitleSlogan />
      <ContainerWithBackground image="/banners/servicos.webp">
        <OurServices />
      </ContainerWithBackground>
      <ContainerWithBackground image="/banners/profissionais.webp">
        <OurProfessionals />
      </ContainerWithBackground>
      <ContainerWithBackground image="/banners/clientes.webp">
        <OurClients />
      </ContainerWithBackground>
    </div>
  )
}

export default Landing
