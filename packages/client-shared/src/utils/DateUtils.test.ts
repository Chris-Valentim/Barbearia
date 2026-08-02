import DateUtils from './DateUtils'

describe('DateUtils.today', () => {
  it('zera horas, minutos, segundos e milissegundos', () => {
    const hoje = DateUtils.today()

    expect(hoje.getHours()).toBe(0)
    expect(hoje.getMinutes()).toBe(0)
    expect(hoje.getSeconds()).toBe(0)
    expect(hoje.getMilliseconds()).toBe(0)
  })

  it('preserva o dia corrente', () => {
    const agora = new Date()
    const hoje = DateUtils.today()

    expect(hoje.getDate()).toBe(agora.getDate())
    expect(hoje.getMonth()).toBe(agora.getMonth())
    expect(hoje.getFullYear()).toBe(agora.getFullYear())
  })
})

describe('DateUtils.applySchedule', () => {
  it('aplica hora e minuto sobre a data recebida', () => {
    const base = new Date(2026, 7, 5)

    const resultado = DateUtils.applySchedule(base, '14:30')

    expect(resultado.getHours()).toBe(14)
    expect(resultado.getMinutes()).toBe(30)
  })

  it('mantém o dia da data original', () => {
    const base = new Date(2026, 7, 5)

    const resultado = DateUtils.applySchedule(base, '09:15')

    expect(resultado.getDate()).toBe(5)
    expect(resultado.getMonth()).toBe(7)
    expect(resultado.getFullYear()).toBe(2026)
  })

  it('não muta a data recebida', () => {
    const base = new Date(2026, 7, 5, 8, 0)

    DateUtils.applySchedule(base, '20:45')

    expect(base.getHours()).toBe(8)
    expect(base.getMinutes()).toBe(0)
  })

  it('interpreta horários com zero à esquerda', () => {
    const resultado = DateUtils.applySchedule(new Date(2026, 7, 5), '08:05')

    expect(resultado.getHours()).toBe(8)
    expect(resultado.getMinutes()).toBe(5)
  })
})

describe('DateUtils.formatDate', () => {
  it('formata por extenso em pt-BR', () => {
    // 5 de agosto de 2026 é uma quarta-feira
    const data = new Date(2026, 7, 5)

    const texto = DateUtils.formatDate(data)

    expect(texto).toContain('2026')
    expect(texto).toContain('agosto')
    expect(texto).toContain('5')
    expect(texto.toLowerCase()).toContain('quarta')
  })
})
