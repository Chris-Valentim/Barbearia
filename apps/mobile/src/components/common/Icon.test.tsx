import { render } from '@testing-library/react-native'
import Icon from './Icon'

describe('Icon', () => {
  it('renderiza sem erro com o nome informado', () => {
    const { toJSON } = render(<Icon nameIcon="home-outline" />)

    expect(toJSON()).toBeTruthy()
  })

  it('usa tamanho 28 por padrão', () => {
    const { toJSON } = render(<Icon nameIcon="home-outline" />)

    expect(JSON.stringify(toJSON())).toContain('28')
  })

  it('respeita o tamanho informado', () => {
    const { toJSON } = render(<Icon nameIcon="home-outline" size={24} />)

    expect(JSON.stringify(toJSON())).toContain('24')
  })

  it('aplica a cor informada', () => {
    const { toJSON } = render(
      <Icon nameIcon="calendar-outline" color="#29a7e4" />,
    )

    expect(JSON.stringify(toJSON())).toContain('#29a7e4')
  })
})
