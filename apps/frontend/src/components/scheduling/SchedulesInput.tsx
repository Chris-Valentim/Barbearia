import { useState } from 'react'
import { cn } from '@/lib/utils'
import { IconX } from '@tabler/icons-react'
import { UsefulAgenda, UsefulDate } from '@barba/core'
import useScheduling from '@/data/hooks/useScheduling'

export interface SchedulesInputProps {
  date: Date
  hourlyQuantity: number
  dateChanged(date: Date): void
}

const SchedulesInput = (props: SchedulesInputProps) => {
  const [hourHover, setHourHover] = useState<string | null>(null)
  const { busySchedules } = useScheduling()
  const { morning, afternoon, night } = UsefulAgenda.timesOfDay()

  const selectedHour = props.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  function getPeriod(time: string | null, amount: number) {
    if (!time) return []
    const schedules = morning.includes(time) ? morning : afternoon.includes(time) ? afternoon : night
    const index = schedules.findIndex((h) => time == h)
    return schedules.slice(index, index + amount)
  }

  function renderTimetable(time: string) {
    const period = getPeriod(hourHover, props.hourlyQuantity)
    const thereAreSchedules = period.length === props.hourlyQuantity
    const highlightTime = thereAreSchedules && period.includes(time)
    const selectedPeriod = getPeriod(selectedHour, props.hourlyQuantity)
    const notSelectable = !thereAreSchedules && period.includes(time)
    const selected = selectedPeriod.length === props.hourlyQuantity && selectedPeriod.includes(time)
    const blockedPeriod = period.includes(time) && period.some((h) => busySchedules.includes(h))
    const busy = busySchedules.includes(time)

    return (
      <div key={time} className={cn(
        'flex justify-center items-center cursor-pointer h-8 border border-zinc-800 rounded select-none',
        {
          'bg-yellow-400': highlightTime,
          'bg-red-500': notSelectable || blockedPeriod,
          'text-white bg-green-500': selected,
          'cursor-not-allowed bg-zinc-800': busy,
        }
      )}
        onMouseEnter={(_) => setHourHover(time)}
        onMouseLeave={(_) => setHourHover(null)}
        onClick={() => {
          if (notSelectable) return
          if (busy || blockedPeriod) return props.dateChanged(UsefulDate.applySchedule(props.date, time))
        }}
      >
        <span
          className={cn('text-sm text-zinc-400', {
            'text-black font-semibold': highlightTime,
            'text-white font-semibold': selected,
            'text-zinc-400 font-semibold': busy,
          })}
        >
          {notSelectable || blockedPeriod || busy ? (
            <IconX size={18} className='text-white' />
          ) : (
            time
          )}
        </span>
      </div>
    )
  }

  return (
    <div className='flex flex-col -gap-5'>
      <span className='text-sm uppercase text-zinc-400'>
        Horários Disponíveis
      </span>
      <div className='flex flex-col gap-3 select-none'>
        <span className='text-xs uppercase text-zinc-400'>
          Manhã
        </span>
        <div className='grid grid-cols-8 gap-1'>
          {morning.map(renderTimetable)}
        </div>
        <span className='text-xs uppercase text-zinc-400'>
          Tarde
        </span>
        <div className='grid grid-cols-8 gap-1'>
          {afternoon.map(renderTimetable)}
        </div>
        <span className='text-xs uppercase text-zinc-400'>
          Noite
        </span>
        <div className='grid grid-cols-8 gap-1'>
          {night.map(renderTimetable)}
        </div>
      </div>
    </div>
  )
}

export default SchedulesInput
