import DayInput from './DayInput'
import SchedulesInput from './SchedulesInput'

export interface DateInputProps {
  date: Date
  numberOfSlots: number
  dateChanged: (date: Date) => void
}

const DateInput = (props: DateInputProps) => {
  const { date, numberOfSlots, dateChanged } = props

  return (
    <div className='flex flex-col gap-10'>
      <DayInput date={date} dateChanged={dateChanged} />
      <SchedulesInput
        date={date}
        hourlyQuantity={numberOfSlots}
        dateChanged={dateChanged}
      />
    </div>
  )
}

export default DateInput
