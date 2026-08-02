import ScheduleUtils from './ScheduleUtils'

describe('ScheduleUtils.timesOfDay', () => {
  const periodos = ScheduleUtils.timesOfDay()

  it('divide o dia em manhã, tarde e noite', () => {
    expect(Object.keys(periodos)).toEqual(['morning', 'afternoon', 'night'])
  })

  it('gera 16 horários por período (4 horas × 4 slots de 15min)', () => {
    expect(periodos.morning).toHaveLength(16)
    expect(periodos.afternoon).toHaveLength(16)
    expect(periodos.night).toHaveLength(16)
  })

  it('cobre 8h–11h pela manhã', () => {
    expect(periodos.morning[0]).toBe('08:00')
    expect(periodos.morning[periodos.morning.length - 1]).toBe('11:45')
  })

  it('cobre 14h–17h à tarde', () => {
    expect(periodos.afternoon[0]).toBe('14:00')
    expect(periodos.afternoon[periodos.afternoon.length - 1]).toBe('17:45')
  })

  it('cobre 18h–21h à noite', () => {
    expect(periodos.night[0]).toBe('18:00')
    expect(periodos.night[periodos.night.length - 1]).toBe('21:45')
  })

  it('deixa o intervalo de almoço (12h e 13h) de fora', () => {
    const todos = [...periodos.morning, ...periodos.afternoon, ...periodos.night]

    expect(todos.some((h) => h.startsWith('12:'))).toBe(false)
    expect(todos.some((h) => h.startsWith('13:'))).toBe(false)
  })

  it('usa sempre o formato HH:MM com dois dígitos', () => {
    const todos = [...periodos.morning, ...periodos.afternoon, ...periodos.night]

    todos.forEach((horario) => expect(horario).toMatch(/^\d{2}:\d{2}$/))
  })

  it('avança de 15 em 15 minutos dentro de cada hora', () => {
    expect(periodos.morning.slice(0, 4)).toEqual([
      '08:00',
      '08:15',
      '08:30',
      '08:45',
    ])
  })

  it('não repete horários', () => {
    const todos = [...periodos.morning, ...periodos.afternoon, ...periodos.night]

    expect(new Set(todos).size).toBe(todos.length)
  })
})
