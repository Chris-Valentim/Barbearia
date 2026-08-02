import { render, screen, fireEvent } from '@testing-library/react-native'
import { Professional } from '@barba/contracts'
import ProfessionalInput from './ProfessionalInput'

const marcao = {
  id: 1,
  name: 'Marcão Machadada',
  description: '...',
  imageUrl: '/professionals/profissional-1.jpg',
  assessment: 5,
  assessmentAmount: 87,
} as Professional

jest.mock('@barba/client-shared', () => ({
  useProfessionals: () => ({
    professionals: [
      {
        id: 1,
        name: 'Marcão Machadada',
        description: '...',
        imageUrl: '/professionals/profissional-1.jpg',
        assessment: 5,
        assessmentAmount: 87,
      },
      {
        id: 2,
        name: 'Beto Brutal',
        description: '...',
        imageUrl: '/professionals/profissional-2.jpg',
        assessment: 4.5,
        assessmentAmount: 42,
      },
    ],
  }),
}))

describe('ProfessionalInput (mobile)', () => {
  it('exibe apenas o primeiro nome, por limitação de espaço', () => {
    render(
      <ProfessionalInput
        professional={null}
        professionalHasChanged={jest.fn()}
      />,
    )

    expect(screen.getByText('Marcão')).toBeOnTheScreen()
    expect(screen.queryByText('Marcão Machadada')).not.toBeOnTheScreen()
  })

  it('lista todos os profissionais', () => {
    render(
      <ProfessionalInput
        professional={null}
        professionalHasChanged={jest.fn()}
      />,
    )

    expect(screen.getByText('Marcão')).toBeOnTheScreen()
    expect(screen.getByText('Beto')).toBeOnTheScreen()
  })

  it('notifica a escolha com o profissional completo', () => {
    const professionalHasChanged = jest.fn()
    render(
      <ProfessionalInput
        professional={null}
        professionalHasChanged={professionalHasChanged}
      />,
    )

    fireEvent.press(screen.getByText('Marcão'))

    expect(professionalHasChanged).toHaveBeenCalledWith(marcao)
  })

  it('permite trocar de profissional', () => {
    const professionalHasChanged = jest.fn()
    render(
      <ProfessionalInput
        professional={marcao}
        professionalHasChanged={professionalHasChanged}
      />,
    )

    fireEvent.press(screen.getByText('Beto'))

    expect(professionalHasChanged).toHaveBeenCalledWith(
      expect.objectContaining({ id: 2 }),
    )
  })
})
