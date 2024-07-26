import { Service } from '@barba/core'
import Image from 'next/image'

export interface ItemServiceProps {
  service: Service
  onClick?: (service: Service) => void
}

const ItemService = (props: ItemServiceProps) => {
  return (
    <div className={`
      flex rounded-xl overflow-hidden bg-zinc-800 ${props.onClick && 'cursor-pointer'} select-none 
    `}>
      <Image
        src={props.service.imageUrl}
        width={150}
        height={150}
        alt={props.service.name}
        className='object-cover'
      />
      <div className='flex flex-col p-5 gap-2'>
        <span className='text-xl font-black'>
          {props.service.name}
        </span>
        <span className='text-xs text-zinc-400 flex-1'>
          {props.service.description}
        </span>
        <span className='text-xs text-zinc-400 flex-1'>
          R$ {props.service.price}
        </span>
      </div>
    </div>
  )
}

export default ItemService
