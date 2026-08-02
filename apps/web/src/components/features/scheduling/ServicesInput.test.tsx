import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Service } from '@barba/contracts'
import ServicesInput from './ServicesInput'

const corte: Service = {
  id: 1,
  name: 'Corte Viking',
  description: '...',
  price: 55,
  slotsAmount: 3,
  imageUrl: '/services/corte-de-cabelo.jpg',
}

const barba: Service = {
  id: 2,
  name: 'Barba de Lenhador',
  description: '...',
  price: 45,
  slotsAmount: 2,
  imageUrl: '/services/corte-de-barba.jpg',
}

jest.mock('@barba/client-shared', () => ({
  useServices: () => ({
    services: [
      {
        id: 1,
        name: 'Corte Viking',
        description: '...',
        price: 55,
        slotsAmount: 3,
        imageUrl: '/services/corte-de-cabelo.jpg',
      },
      {
        id: 2,
        name: 'Barba de Lenhador',
        description: '...',
        price: 45,
        slotsAmount: 2,
        imageUrl: '/services/corte-de-barba.jpg',
      },
    ],
  }),
}))

describe('ServicesInput', () => {
  it('lista todos os serviços disponíveis', () => {
    render(<ServicesInput services={[]} serviceHasChanged={jest.fn()} />)

    expect(screen.getByText('Corte Viking')).toBeInTheDocument()
    expect(screen.getByText('Barba de Lenhador')).toBeInTheDocument()
  })

  it('adiciona um serviço ainda não selecionado', async () => {
    const serviceHasChanged = jest.fn()
    render(
      <ServicesInput services={[]} serviceHasChanged={serviceHasChanged} />,
    )

    await userEvent.click(screen.getByText('Corte Viking'))

    expect(serviceHasChanged).toHaveBeenCalledWith([corte])
  })

  it('acumula seleções em vez de substituir', async () => {
    const serviceHasChanged = jest.fn()
    render(
      <ServicesInput
        services={[corte]}
        serviceHasChanged={serviceHasChanged}
      />,
    )

    await userEvent.click(screen.getByText('Barba de Lenhador'))

    expect(serviceHasChanged).toHaveBeenCalledWith([corte, barba])
  })

  it('remove o serviço ao clicar num já selecionado', async () => {
    const serviceHasChanged = jest.fn()
    render(
      <ServicesInput
        services={[corte, barba]}
        serviceHasChanged={serviceHasChanged}
      />,
    )

    await userEvent.click(screen.getByText('Corte Viking'))

    expect(serviceHasChanged).toHaveBeenCalledWith([barba])
  })

  it('destaca visualmente os serviços selecionados', () => {
    const { container } = render(
      <ServicesInput services={[corte]} serviceHasChanged={jest.fn()} />,
    )

    const selecionados = container.querySelectorAll('.border-green-400')
    expect(selecionados).toHaveLength(1)
  })

  it('não destaca nada quando nada está selecionado', () => {
    const { container } = render(
      <ServicesInput services={[]} serviceHasChanged={jest.fn()} />,
    )

    expect(container.querySelectorAll('.border-green-400')).toHaveLength(0)
  })
})
