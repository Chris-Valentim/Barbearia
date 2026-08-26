export default class DateUtils {
  static today() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  }

  static applySchedule(date: Date, schedule: string): Date {
    const newDate = new Date(date)
    const parts = schedule.split(':')
    newDate.setHours(parseInt(parts[0]!), parseInt(parts[1]!))
    return newDate
  }

  static formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  /**
   * Formata como "YYYY-MM-DD" usando os componentes LOCAIS da data.
   *
   * `toISOString().slice(0, 10)` não serve para isto: ele converte para UTC
   * antes de recortar, então um horário escolhido às 21h em UTC-3 vira o dia
   * seguinte. Como toda a agenda é apresentada em horário local, o dia enviado
   * à api precisa ser o dia que o usuário vê na tela.
   */
  static toISODate(date: Date): string {
    const ano = date.getFullYear()
    const mes = String(date.getMonth() + 1).padStart(2, '0')
    const dia = String(date.getDate()).padStart(2, '0')
    return `${ano}-${mes}-${dia}`
  }
}