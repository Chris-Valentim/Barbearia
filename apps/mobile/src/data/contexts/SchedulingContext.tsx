import { createContext, useCallback, useEffect, useState } from 'react'
import { Professional, Service } from '@barba/contracts'
import { DateUtils } from '@barba/client-shared'
import useUser from '../hooks/useUser'
import useAPI from '../hooks/useAPI'

interface SchedulingContextProps {
  professional: Professional | null
  services: Service[]
  date: Date
  busySchedules: string[]
  totalDuration(): string
  totalPrice(): number
  numberOfSlots(): number
  selectProfessional(professional: Professional): void
  selectServices(services: Service[]): void
  selectDate(date: Date): void
  schedule(): Promise<void>
}

const SchedulingContext = createContext({} as SchedulingContextProps)

const SchedulingProvider = ({ children }: { children: React.ReactNode }) => {
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [date, setDate] = useState<Date>(DateUtils.today())

  const { user } = useUser()
  const [busySchedules, setBusySchedules] = useState<string[]>([])
  const { httpGet, httpPost } = useAPI()

  function selectProfessional(professional: Professional) {
    setProfessional(professional)
  }

  function selectServices(services: Service[]) {
    setServices(services)
  }

  function totalDuration() {
    const duration = services.reduce((acc, current) => {
      return (acc += current.slotsAmount * 15)
    }, 0)

    return `${Math.trunc(duration / 60)}h ${duration % 60}m`
  }

  function totalPrice() {
    return services.reduce((acc, current) => {
      return (acc += current.price)
    }, 0)
  }

  const selectDate = useCallback(function (hour: Date) {
    setDate(hour)
  }, [])

  function numberOfSlots() {
    const totalOfSlots = services.reduce((acc, service) => {
      return (acc += service.slotsAmount)
    }, 0)

    return totalOfSlots
  }

  async function schedule() {
    if (!user?.email) return

    // httpPost lanca quando a api rejeita; nao ha valor de retorno a checar.
    await httpPost('scheduling', {
      emailClient: user.email,
      date: date!,
      professional: professional!,
      services: services
    })

    clean()
  }

  function clean() {
    setDate(DateUtils.today())
    setBusySchedules([])
    setProfessional(null)
    setServices([])
  }

  const getBusySchedules = useCallback(
    async function (date: Date, professional: Professional): Promise<string[]> {
      try {
        if (!date || !professional) return []
        const dtString = DateUtils.toISODate(date)
        const busy = await httpGet(
          `scheduling/busy/${professional!.id}/${dtString}`
        )
        return busy ?? []
      } catch (e) {
        return []
      }
    },
    [httpGet]
  )

  useEffect(() => {
    if (!date || !professional) return
    getBusySchedules(date, professional).then(setBusySchedules)
  }, [date, professional, getBusySchedules])

  return (
    <SchedulingContext.Provider value={{
      date,
      professional,
      busySchedules,
      services,
      totalDuration,
      totalPrice,
      selectDate,
      selectProfessional,
      numberOfSlots,
      selectServices,
      schedule,
    }}>
      {children}
    </SchedulingContext.Provider>
  )
}

export { SchedulingContext, SchedulingProvider }
