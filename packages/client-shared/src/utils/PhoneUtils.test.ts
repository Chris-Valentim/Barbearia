import PhoneUtils from './PhoneUtils'

describe('PhoneUtils.unformat', () => {
  it('remove tudo que não for dígito', () => {
    expect(PhoneUtils.unformat('(11) 98765-4321')).toBe('11987654321')
  })

  it('limita a 11 dígitos', () => {
    expect(PhoneUtils.unformat('119876543219999')).toBe('11987654321')
  })

  it('devolve string vazia para entrada vazia', () => {
    expect(PhoneUtils.unformat('')).toBe('')
  })

  it('tolera null e undefined sem lançar', () => {
    expect(PhoneUtils.unformat(null as unknown as string)).toBe('')
    expect(PhoneUtils.unformat(undefined as unknown as string)).toBe('')
  })
})

describe('PhoneUtils.format', () => {
  it('formata celular de 11 dígitos', () => {
    expect(PhoneUtils.format('11987654321')).toBe('(11) 98765-4321')
  })

  it('formata fixo de 10 dígitos', () => {
    expect(PhoneUtils.format('1133334444')).toBe('(11) 3333-4444')
  })

  it('devolve string vazia para entrada vazia', () => {
    expect(PhoneUtils.format('')).toBe('')
  })

  it('tolera null e undefined sem lançar', () => {
    expect(PhoneUtils.format(null as unknown as string)).toBe('')
    expect(PhoneUtils.format(undefined as unknown as string)).toBe('')
  })

  it('é idempotente sobre um número já formatado', () => {
    const formatado = PhoneUtils.format('11987654321')

    expect(PhoneUtils.format(formatado)).toBe(formatado)
  })

  it('ignora dígitos além do décimo primeiro', () => {
    expect(PhoneUtils.format('11987654321999')).toBe('(11) 98765-4321')
  })
})

describe('PhoneUtils.format — digitação parcial', () => {
  // O formulário formata a cada tecla, então entradas incompletas são o
  // caso comum, não a exceção.
  it('não abre parêntese sozinho com menos de 3 dígitos', () => {
    expect(PhoneUtils.format('1')).toBe('(1')
    expect(PhoneUtils.format('11')).toBe('(11')
  })

  it('não deixa hífen sobrando antes do sétimo dígito', () => {
    expect(PhoneUtils.format('119')).toBe('(11) 9')
    expect(PhoneUtils.format('119876')).toBe('(11) 9876')
  })

  it('introduz o hífen a partir do sétimo dígito', () => {
    expect(PhoneUtils.format('1198765')).toContain('-')
  })

  it('nunca deixa placeholder "x" no resultado', () => {
    for (let i = 1; i <= 11; i++) {
      const parcial = '11987654321'.slice(0, i)

      expect(PhoneUtils.format(parcial)).not.toContain('x')
    }
  })
})
