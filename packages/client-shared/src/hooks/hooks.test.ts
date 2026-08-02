import useServices from './useServices'
import useProfessionals from './useProfessionals'

describe('useServices', () => {
  it('devolve a lista de serviços', () => {
    const { services } = useServices()

    expect(Array.isArray(services)).toBe(true)
    expect(services.length).toBeGreaterThan(0)
  })

  it('entrega serviços com o contrato completo', () => {
    const { services } = useServices()

    services.forEach((servico) => {
      expect(typeof servico.id).toBe('number')
      expect(typeof servico.name).toBe('string')
      expect(typeof servico.description).toBe('string')
      expect(typeof servico.price).toBe('number')
      expect(typeof servico.slotsAmount).toBe('number')
      expect(typeof servico.imageUrl).toBe('string')
    })
  })

  it('não tem ids duplicados', () => {
    const { services } = useServices()
    const ids = services.map((s) => s.id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('só tem serviços com preço e duração positivos', () => {
    const { services } = useServices()

    services.forEach((servico) => {
      expect(servico.price).toBeGreaterThan(0)
      expect(servico.slotsAmount).toBeGreaterThan(0)
    })
  })
})

describe('useProfessionals', () => {
  it('devolve a lista de profissionais', () => {
    const { professionals } = useProfessionals()

    expect(Array.isArray(professionals)).toBe(true)
    expect(professionals.length).toBeGreaterThan(0)
  })

  it('entrega profissionais com o contrato completo', () => {
    const { professionals } = useProfessionals()

    professionals.forEach((profissional) => {
      expect(typeof profissional.id).toBe('number')
      expect(typeof profissional.name).toBe('string')
      expect(typeof profissional.description).toBe('string')
      expect(typeof profissional.imageUrl).toBe('string')
      expect(typeof profissional.assessment).toBe('number')
      expect(typeof profissional.assessmentAmount).toBe('number')
    })
  })

  it('não tem ids duplicados', () => {
    const { professionals } = useProfessionals()
    const ids = professionals.map((p) => p.id)

    expect(new Set(ids).size).toBe(ids.length)
  })

  it('mantém a avaliação entre 0 e 5', () => {
    const { professionals } = useProfessionals()

    professionals.forEach((profissional) => {
      expect(profissional.assessment).toBeGreaterThanOrEqual(0)
      expect(profissional.assessment).toBeLessThanOrEqual(5)
    })
  })
})
