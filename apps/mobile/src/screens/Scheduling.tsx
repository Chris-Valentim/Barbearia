'use client'
import { useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Professional, Service } from '@barba/contracts'
import useScheduling from '../data/hooks/useScheduling'
import ServicesInput from '../components/scheduling/ServicesInput'
import ProfessionalInput from '../components/scheduling/ProfessionalInput'
import Steps from '../components/scheduling/Steps'
import DateInput from '../components/scheduling/DateInput'

const Scheduling = ({ navigation }: any) => {
  const [allowsNextStep, setAllowsNextStep] = useState<boolean>(false)
  const {
    professional,
    services,
    date,
    selectProfessional,
    selectServices,
    selectDate,
    numberOfSlots,
  } = useScheduling()

  function professionalChanged(professional: Professional) {
    selectProfessional(professional)
    setAllowsNextStep(!!professional)
  }

  function servicesChanged(services: Service[]) {
    selectServices(services)
    setAllowsNextStep(services.length > 0)
  }

  function dateChanged(date: Date) {
    selectDate(date)

    const hasDate = date
    const validTime = date.getHours() >= 8 && date.getHours() <= 21
    setAllowsNextStep(hasDate && validTime)
  }

  return (
    <SafeAreaView style={{ ...styles.areaView }}>
      <ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
        <View style={styles.container}>
          <Text style={styles.title}>
            Agende seu horário
          </Text>
          <Steps
            labels={['Profissional', 'Serviços', 'Horário']}
            allowsNextStep={allowsNextStep}
            allowsNextStepChanged={setAllowsNextStep}
            finish={() => navigation.navigate('Summary')}
          >
            <ProfessionalInput professional={professional} professionalHasChanged={professionalChanged} />
            <ServicesInput services={services} servicesChanged={servicesChanged} />
            <DateInput
              date={date}
              dateChanged={dateChanged}
              numberOfSlots={numberOfSlots()}
            />
          </Steps>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  areaView: {
    display: 'flex',
    flex: 1,
    gap: 12,
    width: '100%',
    backgroundColor: 'black',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    width: '100%',
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
})

export default Scheduling
