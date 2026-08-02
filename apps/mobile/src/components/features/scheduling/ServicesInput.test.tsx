import { render, screen, fireEvent } from '@testing-library/react-native'
import { Service } from '@barba/contracts'
import ServicesInput from './ServicesInput'

const corte = {
  id: 1,
  name: 'Corte Viking',
  description: '...',
  price: 55,
  slotsAmount: 3,
  imageUrl: '/services/corte-de-cabelo.jpg',
} as Service

const barba = {
  id: 2,
  name: 'Barba de Lenhador',
  description: '...',
  price: 45,
  slotsAmount: 2,
  imageUrl: '/services/corte-de-barba.jpg',
} as Service

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

describe('ServicesInput (mobile)', () => {
  it('lista todos os serviços disponíveis', () => {
    render(<ServicesInput services={[]} servicesChanged={jest.fn()} />)

    expect(screen.getByText('Corte Viking')).toBeOnTheScreen()
    expect(screen.getByText('Barba de Lenhador')).toBeOnTheScreen()
  })

  it('adiciona um serviço ao tocar num não selecionado', () => {
    const servicesChanged = jest.fn()
    render(<ServicesInput services={[]} servicesChanged={servicesChanged} />)

    fireEvent.press(screen.getByText('Corte Viking'))

    expect(servicesChanged).toHaveBeenCalledWith([corte])
  })

  it('acumula seleções em vez de substituir', () => {
    const servicesChanged = jest.fn()
    render(
      <ServicesInput services={[corte]} servicesChanged={servicesChanged} />,
    )

    fireEvent.press(screen.getByText('Barba de Lenhador'))

    expect(servicesChanged).toHaveBeenCalledWith([corte, barba])
  })

  it('remove o serviço ao tocar num já selecionado', () => {
    const servicesChanged = jest.fn()
    render(
      <ServicesInput
        services={[corte, barba]}
        servicesChanged={servicesChanged}
      />,
    )

    fireEvent.press(screen.getByText('Corte Viking'))

    expect(servicesChanged).toHaveBeenCalledWith([barba])
  })

  it('mantém a mesma regra de alternância da web', () => {
    // A lógica de toggle está duplicada entre web e mobile; enquanto isso
    // for verdade, os dois testes precisam descrever o mesmo comportamento.
    const servicesChanged = jest.fn()
    render(
      <ServicesInput services={[corte]} servicesChanged={servicesChanged} />,
    )

    fireEvent.press(screen.getByText('Corte Viking'))

    expect(servicesChanged).toHaveBeenCalledWith([])
  })
})
