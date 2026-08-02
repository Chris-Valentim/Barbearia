import { ScheduleUtils, DateUtils } from "@barba/client-shared";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import useScheduling from '../../../data/hooks/useScheduling'

interface SchedulesInputProps {
  date: Date
  numberOfHours: number
  dateChanged(date: Date): void
}

const SchedulesInput = (props: SchedulesInputProps) => {
  const [currentTime, setCurrentTime] = useState<string | null>(null)
  const { busySchedules } = useScheduling()
  const { morning, afternoon, night } = ScheduleUtils.timesOfDay()

  const selectedHour = props.date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  function getPeriod(time: string | null, amount: number) {
    if (!time) return []
    const schedules = morning.includes(time) ? morning : afternoon.includes(time) ? afternoon : night
    const index = schedules.findIndex((h) => time == h)
    return schedules.slice(index, index + amount)
  }

  function renderTimetable(time: string) {
    const period = getPeriod(currentTime, props.numberOfHours)
    const thereAreSchedules = period.length === props.numberOfHours
    const unavailableTime = thereAreSchedules && period.includes(time)
    const selectedPeriod = getPeriod(selectedHour, props.numberOfHours)
    const selected = selectedPeriod.length === props.numberOfHours && selectedPeriod.includes(time)
    const blockedPeriod = period.includes(time) && period.some((h) => busySchedules.includes(h))
    const busy = busySchedules.includes(time)

    const getButtonProps = () => {
      if (selected && !blockedPeriod && !busy) {
        return {
          background: '#22c55e',
          disabled: false,
        }
      } else if (blockedPeriod && !busy && unavailableTime) {
        return {
          background: '#ef4444',
          disabled: true,
        }
      } else if (!thereAreSchedules && !busy && selectedPeriod.includes(time)) {
        return {
          background: '#ef4444',
          disabled: true,
        }
      } else if (busy) {
        return {
          background: '#09090b',
          disabled: true,
        }
      } else {
        return {
          background: '#18181b',
          disabled: false,
        }
      }
    }

    // Avaliado uma vez por render: getButtonProps era chamado três vezes,
    // e dentro do onPress lia o currentTime anterior ao toque.
    const buttonProps = getButtonProps()

    return (
      <Pressable
        key={time}
        onPress={() => {
          setCurrentTime(time)
          // A guarda estava invertida: só o horário INDISPONÍVEL disparava a
          // seleção, e o horário livre não fazia nada.
          if (busy || blockedPeriod) return
          props.dateChanged(DateUtils.applySchedule(props.date, time))
        }}
        style={{ ...styles.hourContainer, backgroundColor: buttonProps.background }}
      >
        {buttonProps.disabled ? (
          <View style={styles.hourContent}>
            <Text style={{ color: '#e4e4e7' }}>
              X
            </Text>
          </View>
        ) : (
          <View style={styles.hourContent}>
            <Text style={{ color: '#e4e4e7' }}>
              {time}
            </Text>
          </View>
        )}
      </Pressable>
    )
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.hoursText}>
          Manhã
        </Text>
        <View style={styles.hoursContent}>
          {morning.map(renderTimetable)}
        </View>
      </View>
      <View>
        <Text style={styles.hoursText}>
          Tarde
        </Text>
        <View style={styles.hoursContent}>
          {afternoon.map(renderTimetable)}
        </View>
      </View>
      <View>
        <Text style={styles.hoursText}>
          Noite
        </Text>
        <View style={styles.hoursContent}>
          {night.map(renderTimetable)}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 30,
  },
  hoursText: {
    color: '#e4e4e7',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  hoursContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  hourContent: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  hourContainer: {
    borderWidth: 1,
    borderColor: '#27272a',
    padding: 10,
    borderRadius: 6,
    width: 90,
  }
})

export default SchedulesInput
