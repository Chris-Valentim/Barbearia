export default class UsefulAgenda {
  private static minutes = [0, 15, 30, 45]

  static timesOfDay() {
    return {
      morning: this.generateSchedules([8, 9, 10, 11]),
      afternoon: this.generateSchedules([14, 15, 16, 17]),
      night: this.generateSchedules([18, 19, 20, 21]),
    }
  }

  private static generateSchedules(hours: number[]) {
    return hours.reduce((schedules, hour) => {
      const all = this.minutes.map((minutes) => {
        return `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
      })
      return schedules.concat(all)
    }, [] as string[])
  }
}