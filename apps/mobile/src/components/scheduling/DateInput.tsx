import { View } from "react-native";
import SchedulesInput from './SchedulesInput'
import DayInput from './DayInput'

export interface DateInputProps {
  date: Date
  numberOfSlots: number
  dateChanged: (date: Date) => void
}

const DateInput = (props: DateInputProps) => {
  const { date, numberOfSlots, dateChanged } = props

  return (
    <View>
      <DayInput date={date} dateChanged={dateChanged} />
      <SchedulesInput
        date={date}
        numberOfHours={numberOfSlots}
        dateChanged={dateChanged}
      />
    </View>
  )
}

export default DateInput
