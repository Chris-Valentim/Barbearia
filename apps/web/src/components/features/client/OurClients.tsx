import { clients } from '@barba/contracts'
import { LayoutGrid } from '@/components/ui/layout-grid'
import CustomerItem from '@/components/features/client/CustomerItem'
import Title from '@/components/common/Title'
// LayoutGrid renderiza a thumbnail em <motion.img>, que nao passa pelo loader
// do next/image — o basePath precisa ser aplicado aqui.
import { withBasePath } from '@/lib/imageLoader'

const OurClients = () => {
  const classes = ['md:col-span-2', 'col-span-1', 'col-span-1', 'md:col-span-2']

  const cards = clients.map((client, i) => {
    return {
      id: client.id,
      content: <CustomerItem name={client.name}
        testimony={client.testimony} />,
      className: classes[i],
      thumbnail: withBasePath(client.imageUrl)
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