import { StyleSheet, Text, Pressable, View } from "react-native";
import { UsefulDate } from "@barba/core";
import useScheduling from "../data/hooks/useScheduling";

const Summary = ({ navigation }: any) => {
  const {
    date,
    professional,
    services,
    totalDuration,
    totalPrice,
    schedule
  } = useScheduling()

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          Resumo do Agendamento
        </Text>
        <Text style={styles.subtitle}>
          Será um prazer atendê-lo!
        </Text>

        <Text style={styles.label}>
          PROFISSIONAL
        </Text>
        <Text style={styles.value}>
          {professional?.name}
        </Text>

        <Text style={styles.label}>
          SERVIÇOS
        </Text>
        {services.map((s, index) => (
          <Text key={index} style={styles.service}>
            {index + 1}. {s.name}
          </Text>
        ))}

        <Text style={styles.label}>
          DURAÇÃO
        </Text>
        <Text style={styles.value}>
          {totalDuration()}
        </Text>

        <Text style={styles.label}>
          HORÁRIOS
        </Text>
        <Text style={styles.value}>
          {date && UsefulDate.formatDate(date)}
        </Text>

        <Text style={styles.totalLabelValue}>
          VALOR TOTAL
        </Text>
        <Text style={styles.totalValue}>
          R${totalPrice()},00
        </Text>

        <Pressable
          style={styles.button}
          onPress={async () => {
            await schedule()
            navigation.navigate('Start')
          }}
        >
          <Text style={styles.textButton}>
            Finalizar Agendamento
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    gap: 5,
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 20,
  },
  label: {
    color: '#aaaaaa',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  value: {
    color: '#aaaaaa',
    fontSize: 16,
    alignSelf: 'flex-start'
  },
  service: {
    color: '#ffffff',
    fontSize: 16,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  totalLabelValue: {
    color: '#aaaaaa',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  totalValue: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  button: {
    backgroundColor: '#22c55e',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 30,
  },
  textButton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default Summary
