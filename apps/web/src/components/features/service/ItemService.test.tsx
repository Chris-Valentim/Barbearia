import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Service } from '@barba/contracts'
import ItemService from './ItemService'

const servico: Service = {
  id: 1,
  name: 'Corte Viking',
  description: 'Lâmina na pele e estilo de guerreiro.',
  price: 55,
  slotsAmount: 3,
  imageUrl: '/services/corte-de-cabelo.jpg',
}

describe('ItemService', () => {
  it('exibe nome, descrição e preço', () => {
    render(<ItemService service={servico} />)

    expect(screen.getByText('Corte Viking')).toBeInTheDocument()
    expect(
      screen.getByText('Lâmina na pele e estilo de guerreiro.'),
    ).toBeInTheDocument()
    expect(screen.getByText(/55/)).toBeInTheDocument()
  })

  it('usa o nome do serviço como texto alternativo da imagem', () => {
    render(<ItemService service={servico} />)

    expect(screen.getByAltText('Corte Viking')).toBeInTheDocument()
  })

  it('dispara onClick com o serviço', async () => {
    const onClick = jest.fn()
    render(<ItemService service={servico} onClick={onClick} />)

    await userEvent.click(screen.getByText('Corte Viking'))

    expect(onClick).toHaveBeenCalledWith(servico)
  })

  it('não quebra ao clicar sem onClick', async () => {
    render(<ItemService service={servico} />)

    await userEvent.click(screen.getByText('Corte Viking'))

    expect(screen.getByText('Corte Viking')).toBeInTheDocument()
  })

  it('só sinaliza clicável quando há onClick', () => {
    const { container, rerender } = render(<ItemService service={servico} />)
    expect(container.firstChild).not.toHaveClass('cursor-pointer')

    rerender(<ItemService service={servico} onClick={jest.fn()} />)
    expect(container.firstChild).toHaveClass('cursor-pointer')
  })
})
