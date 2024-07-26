'use client'
import { Service } from "@barba/core"
import { useRouter } from 'next/navigation'
import ItemService from "./ItemService"
import Title from "../shared/Title"
import useServices from "@/data/hooks/useServices"

const OurServices = () => {
  const router = useRouter()
  const { services } = useServices()

  function startScheduling() {
    router.push('/scheduling')
  }

  return (
    <div className="flex flex-col gap-16">
      <Title
        tag='Serviços'
        main='Do Classico ao Rock'
        secondary="Cabelo afiado, barba de lenhador e mãos de motoqueiro, tudo ao som de rock pesado!"
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {services.map((service: Service) => (
          <ItemService
            key={service.id}
            service={service}
            onClick={startScheduling}
          />
        ))}
      </div>
    </div>
  )
}

export default OurServices
