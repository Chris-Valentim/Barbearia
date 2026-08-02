import { useServices } from "@barba/client-shared";
import { Service } from "@barba/contracts";
import { Image, StyleSheet, Text, Pressable, View } from "react-native";
import images from '../../../data/constants/images'

interface ServicesInputProps {
  services: Service[]
  servicesChanged: (services: Service[]) => void
}

function Option(props: { service: Service; onClick: (s: Service) => void; selected?: boolean }) {
  return (
    <View
      key={props.service.id}
      style={{
        ...styles.serviceCard,
        backgroundColor: props.selected ? '#22c55e' : '#18181b'
      }}
    >
      <Pressable
        onPress={() => {
          props.onClick(props.service)
        }}
      >
        <View>
          <Image
            style={styles.imageService}
            source={images.services.find((s) => s.id === props.service.id)?.image} />
          <Text style={styles.textService}>
            {props.service.name}
          </Text>
        </View>
      </Pressable>
    </View>
  )
}

const ServicesInput = (props: ServicesInputProps) => {
  const { services, servicesChanged } = props
  const { services: allServices } = useServices()

  function toggleServiceAppointment(service: Service) {
    const found = services.find((s) => s.id === service.id)
    servicesChanged(
      found ? services.filter((s) => s.id !== service.id) : [...services, service]
    )
  }

  return (
    <View style={styles.container}>
      {allServices.map((s) => (
        <Option
          key={s.id}
          onClick={toggleServiceAppointment}
          service={s}
          selected={services.some((serv) => serv.id === s.id)}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 40,
    gap: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',

  },
  serviceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#18181b',
    borderRadius: 8,
    padding: 2,
  },
  serviceCard: {
    borderRadius: 8,
    padding: 2,
  },
  textService: {
    color: 'white',
    paddingVertical: 5,
    textAlign: 'center',
  },
  imageService: {
    width: 122,
    height: 122,
    borderRadius: 6,
  },
})

export default ServicesInput
