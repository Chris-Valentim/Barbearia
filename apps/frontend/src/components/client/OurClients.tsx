import { clients } from '@barba/core'
import { LayoutGrid } from '../ui/layout-grid'
import CustomerItem from './CustomerItem'
import Title from '@/components/shared/Title'

const OurClients = () => {
  const classes = ['md:col-span-2', 'col-span-1', 'col-span-1', 'md:col-span-2']

  const cards = clients.map((client, i) => {
    return {
      id: client.id,
      content: <CustomerItem name={client.name} testimony={client.testimony} />,
      className: classes[i],
      thumbnail: client.imageUrl
    }
  })

  return (
    <div className='container flex flex-col items-center gap-16'>
      <Title
        tag='Clientes'
        main='Quem Manda Aqui'
        secondary='Nossos clientes são os chefes! Aqui, eles mandam, desmandam e ainda saem com estilo de rockstar'
      />
      <div className='h-[900px] w-full'>
        <LayoutGrid cards={cards} />
      </div>
    </div>
  )
}

export default OurClients