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

describe('DateUtils.toISODate', () => {
  it('formata como YYYY-MM-DD', () => {
    expect(DateUtils.toISODate(new Date(2026, 7, 5))).toBe('2026-08-05')
  })

  it('preenche mês e dia com zero à esquerda', () => {
    expect(DateUtils.toISODate(new Date(2026, 0, 9))).toBe('2026-01-09')
  })

  // Regressão: o contexto usava toISOString().slice(0,10), que converte para
  // UTC antes de recortar. Um horário escolhido às 21h em UTC-3 virava o dia
  // seguinte, e a agenda consultava a ocupação do dia errado.
  it('usa o dia local mesmo em horário tardio', () => {
    expect(DateUtils.toISODate(new Date(2026, 7, 5, 21, 0))).toBe('2026-08-05')
    expect(DateUtils.toISODate(new Date(2026, 7, 5, 23, 59))).toBe('2026-08-05')
  })

  it('usa o dia local mesmo em horário bem cedo', () => {
    expect(DateUtils.toISODate(new Date(2026, 7, 5, 0, 1))).toBe('2026-08-05')
  })

  it('não muda o dia na virada de ano', () => {
    expect(DateUtils.toISODate(new Date(2026, 11, 31, 22, 0))).toBe('2026-12-31')
  })

  it('corresponde ao dia que formatDate apresenta ao usuário', () => {
    const data = new Date(2026, 7, 5, 21, 30)

    expect(DateUtils.toISODate(data)).toContain('05')
    expect(DateUtils.formatDate(data)).toContain('5')
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
