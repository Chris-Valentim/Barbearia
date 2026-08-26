import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native'
import ProfileCard from './ProfileCard'

// signOut grava no AsyncStorage, então devolve Promise.
const signOut = jest.fn().mockResolvedValue(undefined)
const mockUseUser = jest.fn()

jest.mock('../../../data/hooks/useUser', () => ({
  __esModule: true,
  default: () => mockUseUser(),
}))

const navigation = { replace: jest.fn(), navigate: jest.fn() }

describe('ProfileCard', () => {
  beforeEach(() => {
    signOut.mockReset().mockResolvedValue(undefined)
    navigation.replace.mockReset()
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

  it('volta para o cadastro após sair', async () => {
    render(<ProfileCard navigation={navigation} />)

    fireEvent.press(screen.getByText('SAIR'))

    await waitFor(() =>
      expect(navigation.replace).toHaveBeenCalledWith('Register'),
    )
  })

  // Regressão: signOut virou assíncrono ao passar a usar AsyncStorage. Sem
  // await, a navegação acontecia antes de a sessão sair do disco.
  it('só navega depois que a sessão foi limpa', async () => {
    const ordem: string[] = []
    signOut.mockImplementation(async () => {
      ordem.push('signOut')
    })
    navigation.replace.mockImplementation(() => {
      ordem.push('replace')
    })
    render(<ProfileCard navigation={navigation} />)

    fireEvent.press(screen.getByText('SAIR'))

    await waitFor(() => expect(ordem).toEqual(['signOut', 'replace']))
  })
})
