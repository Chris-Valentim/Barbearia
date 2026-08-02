import { useProfessionals } from "@barba/client-shared";
import { Professional } from "@barba/contracts";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import images from '../../../data/constants/images'

export interface ProfessionalInputProps {
  professional: Professional | null
  professionalHasChanged: (professional: Professional) => void
}

const ProfessionalInput = (props: ProfessionalInputProps) => {
  const { professional, professionalHasChanged } = props
  const { professionals } = useProfessionals()

  function renderProfessional(p: Professional) {
    return (
      <View
        key={p?.id}
        style={{
          ...styles.professionalContainer,
          backgroundColor: professional?.id === p?.id ?
            '#22c55e' : '#18181b',
        }}
      >
        <Pressable onPress={() => professionalHasChanged(p)}>
          <View style={{ alignItems: 'center' }}>
            <Image
              style={{ width: 100, height: 100, borderRadius: 6 }}
              source={images.professionals.find((pr) => pr.id === p.id)?.image}
            />
            <Text style={{ color: 'white', paddingVertical: 5 }}>
              {p.name.split(' ')[0]}
            </Text>
          </View>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {professionals.map((p) => renderProfessional(p))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 40,
    gap: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  professionalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 2,
  }
})

export default ProfessionalInput
