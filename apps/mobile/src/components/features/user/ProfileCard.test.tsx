import { render, screen, fireEvent } from '@testing-library/react-native'
import ProfileCard from './ProfileCard'

const signOut = jest.fn()
const mockUseUser = jest.fn()

jest.mock('../../../data/hooks/useUser', () => ({
  __esModule: true,
  default: () => mockUseUser(),
}))

const navigation = { replace: jest.fn(), navigate: jest.fn() }

describe('ProfileCard', () => {
  beforeEach(() => {
    signOut.mockClear()
    navigation.replace.mockClear()
    mockUseUser.mockReturnValue({
      user: {
        name: 'Christian',
        email: 'CHRIS@BARBA.COM',
        phone: '11987654321',
      },
      signOut,
      loading: false,
    })
  })

  it('saúda o usuário pelo nome', () => {
    render(<ProfileCard navigation={navigation} />)

    expect(screen.getByText('Fala, Christian!')).toBeOnTheScreen()
  })

  it('normaliza o e-mail para minúsculas', () => {
    render(<ProfileCard navigation={navigation} />)

    expect(screen.getByText('E-mail: chris@barba.com')).toBeOnTheScreen()
  })

  it('formata o telefone', () => {
    render(<ProfileCard navigation={navigation} />)

    expect(screen.getByText('Telefone: (11) 98765-4321')).toBeOnTheScreen()
  })

  it('encerra a sessão ao tocar em SAIR', () => {
    render(<ProfileCard navigation={navigation} />)

    fireEvent.press(screen.getByText('SAIR'))

    expect(signOut).toHaveBeenCalledTimes(1)
  })

  it('volta para o cadastro após sair', () => {
    render(<ProfileCard navigation={navigation} />)

    fireEvent.press(screen.getByText('SAIR'))

    expect(navigation.replace).toHaveBeenCalledWith('Register')
  })
})
