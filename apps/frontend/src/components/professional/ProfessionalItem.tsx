import {
  IconBrandYoutube,
  IconBrandInstagram,
  IconBrandX,
  IconBrandLinkedin,
} from '@tabler/icons-react'
import { Professional } from '@barba/core'
import Image from 'next/image'
import Assessment from '../shared/Assessment'

export interface ProfessionalItemProps {
  professional: Professional
}

const ProfessionalItem = (props: ProfessionalItemProps) => {
  return (
    <div className='flex flex-col items-center p-1 bg-zinc-800 rounded-lg'>
      <div className='relative h-72 w-full'>
        <Image
          src={props.professional.imageUrl}
          fill
          alt={props.professional.name}
          className='object-cover object-top rounded-t-lg'
        />
      </div>
      <div className='flex gap-3 flex-wrap'>
        <Assessment value={props.professional.assessment} amount={props.professional.assessmentAmount} />
      </div>
      <div className='flex gap-3 text-zinc-300'>
        <IconBrandYoutube stroke={1} />
        <IconBrandInstagram stroke={1} />
        <IconBrandX stroke={1} />
        <IconBrandLinkedin stroke={1} />
      </div>
    </div>
  )
}

export default ProfessionalItem
