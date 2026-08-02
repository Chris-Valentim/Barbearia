import { StyleSheet, Text, View, Image } from "react-native";
import { Scheduling } from "@barba/contracts";
import useAPI from "../../../data/hooks/useAPI";
import { useEffect, useState } from "react";
import SchedulingItem from './SchedulingItem'
import useUser from "../../../data/hooks/useUser";

const LatestAppointments = () => {
  const [scheduling, setScheduling] = useState<Scheduling[]>()
  const { httpGet } = useAPI()
  const { user } = useUser()

  useEffect(() => {
    loadAppointments()
  }, [user])

  async function loadAppointments() {
    if (!user?.email) return
    const scheduling = await httpGet(`scheduling/${user?.email}`)
    setScheduling(scheduling)
  }

  function renderContent() {
    if (scheduling && scheduling?.length > 0) {
      return (
        <View>
          <Text style={styles.subtitle}>
            Aqui estão seus últimos agendamentos:
          </Text>
          {/* toReversed via cópia: `reverse()` muta o próprio array de estado,
              então a ordem se invertia de novo a cada re-render. */}
          {[...(scheduling ?? [])]
            .reverse()
            .map((a: Scheduling) => <SchedulingItem scheduling={a} key={a.id} />)}
        </View>
      )
    } else {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.subtitle}>
            Você ainda não tem agendamentos.
          </Text>
          <Text style={styles.subtitle}>
            Vamos agendar um novo serviço?
          </Text>
          <Image source={require('../../../../assets/start/garoto-propaganda.png')} style={styles.propagatingBoy} />
        </View>
      )
    }
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../../../assets/start/logo-brutal.png')} style={styles.logo} />
      <Text style={styles.title}>
        Fala, {user?.name}!
      </Text>
      {renderContent()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 30,
    color: '#e4e4e7',
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#e4e4e7',
  },
  schedulingItemContainer: {
    backgroundColor: '#09090b',
    borderRadius: 10,
    height: 144,
  },
  schedulingItemContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
  },
  schedulingItemText: {
    fontSize: 16,
    color: 'white',
  },
  schedulingTitle: {
    fontSize: 40,
    color: 'white',
  },
  schedulingHour: {
    fontSize: 25,
    color: 'white',
  },
  logo: {
    marginTop: 20,
  },
  propagatingBoy: {
    marginBottom: 20,
    marginTop: 20,
  },
})

export default LatestAppointments
