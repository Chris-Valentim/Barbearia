import { useServices } from '@barba/ui'
import { Service } from '@barba/core'
import Image from 'next/image'

export interface ServicesInputProps {
  services: Service[]
  serviceHasChanged: (services: Service[]) => void
}

export const Option = (props: { service: Service; onClick: (s: Service) => void; selected?: boolean }) => {
  return (
    <div
      className={`flex flex-col items-center cursor-pointer select-none border rounded-lg overflow-hidden ${props.selected ? 'border-green-400' : 'border-zinc-700'}`}
      onClick={() => props.onClick(props.service)}
    >
      <Image
        src={props.service.imageUrl}
        alt={props.service.name}
        width={150}
        height={150}
      />
      <div
        className={`py-2 w-full text-center text-xs ${props.selected ? 'text-black bg-green-400 font-semibold' : 'text-zinc-400 font-light bg-zinc-900'}`}
      >
        {props.service.name}
      </div>
    </div>
  )
}

const ServicesInput = (props: ServicesInputProps) => {
  const { serviceHasChanged } = props
  const { services: allServices } = useServices()

  function changeServiceAppointment(service: Service) {
    const selectedService = props.services.find((s) => s.id === service.id)
    serviceHasChanged(
      selectedService ? props.services.filter((s) => s.id !== service.id)
        : [...props.services, service]
    )
  }

  return (
    <div className='flex flex-col gap-5'>
      <span className='text-sm uppercase text-zinc-400'>
        Serviços Disponíveis
      </span>
      <div className='grid grid-cols-3 gap-5'>
        {allServices.map((service) => (
          <Option
            key={service.id}
            service={service}
            onClick={changeServiceAppointment}
            selected={props.services.some((serv) => serv.id === service.id)}
          />
        ))}
      </div>
    </div>
  )
}

export default ServicesInput
