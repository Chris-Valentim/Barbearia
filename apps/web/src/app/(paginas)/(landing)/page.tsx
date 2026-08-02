'use client'

import OurClients from '@/components/features/client/OurClients'
import TitleSlogan from '@/components/features/landing/TitleSlogan'
import OurProfessionals from '@/components/features/professional/OurProfessionals'
import OurServices from '@/components/features/service/OurServices'
import ContainerWithBackground from '@/components/common/ContainerWithBackground'

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
