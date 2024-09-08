import { Scheduling } from '@barba/core'
import { StyleSheet, Text, View } from 'react-native'

interface SchedulingItemProps {
  scheduling: Scheduling
}

const SchedulingItem = (props: SchedulingItemProps) => {
  const color = new Date(props.scheduling.date).getTime() > Date.now() ? '#007aff' : '#aaaaaa'

  function formatDate(date: Date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return ''
    }

    return date.toLocaleDateString('pt-BR', {
      dateStyle: 'long',
    })
  }

  function formatTime(date: Date) {
    if (!(date instanceof Date) || isNaN(date.getTime()))
      return ''

    return ` às ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}h`
  }

  function addTotalServices() {
    return props.scheduling.services.reduce((acc, service) => acc + service.price, 0)
  }

  function renderServices() {
    return props.scheduling.services.reduce((acc, service, index) => {
      return `${acc}${index + 1}. ${service.name}${index < props.scheduling.services.length - 1 ? ', ' : ''}`
    }, '')
  }

  return (
    <View style={{ ...styles.card, borderColor: color }}>
      <Text style={{ ...styles.professionalName }}>
        {props.scheduling.professional.name ? props.scheduling.professional.name : 'Não informado'}
      </Text>
      <Text style={{ ...styles.date, color: color }}>
        {props.scheduling.date && formatDate(new Date(props.scheduling.date))}
        {props.scheduling.date && formatTime(new Date(props.scheduling.date))}
      </Text>
      <Text style={styles.services}>
        {renderServices()}
      </Text>
      <Text style={styles.price}>
        {`R$ ${addTotalServices()},00`}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    paddingLeft: 35,
    borderRadius: 8,
    margin: 8,
    borderWidth: 0.5,
    borderRightWidth: 10,
    minWidth: '90%',
  },
  professionalName: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 4,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  services: {
    fontSize: 12,
    color: '#ffffff',
    marginBottom: 8,
  },
  price: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
})


export default SchedulingItem
