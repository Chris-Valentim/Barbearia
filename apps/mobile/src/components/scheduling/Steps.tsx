import { StyleSheet, Text, Pressable, View } from "react-native";
import { useState } from "react";

export interface StepsProps {
  labels: string[]
  children: any
  allowsNextStep: boolean
  allowsNextStepChanged(value: boolean): void
  finish(): void
}

const Steps = (props: StepsProps) => {
  const [currentSteps, setCurrentSteps] = useState(0)

  function previousStep() {
    setCurrentSteps(currentSteps - 1)
    props.allowsNextStepChanged(true)
  }

  function nextSteps() {
    setCurrentSteps(currentSteps + 1)
    props.allowsNextStepChanged(false)
  }

  function renderSteps() {
    return (
      <View style={styles.stepContainer}>
        {props.labels.map((label, i) => (
          <View key={label} style={styles.step}>
            <View
              style={{
                ...styles.stepNumber,
                backgroundColor: i <= currentSteps ?
                  '#e4e4e7' : '#71717a',
              }}
            >
              <Text>
                {i + 1}
              </Text>
            </View>
            <Text
              style={{
                ...styles.stepText,
                color: i <= currentSteps ? 'white' : '#3f3f46'
              }}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>
    )
  }

  function renderButton(text: string, enable: boolean, onPress: () => void) {
    return (
      <View style={styles.buttonContainer}>
        <Pressable
          disabled={!enable}
          onPress={onPress}
          style={{ borderRadius: 5, }}
        >
          <View
            style={{
              ...styles.button,
              backgroundColor: enable ?
                '#27272a' : '#18181b',
            }}>
            <Text style={styles.buttonText}>
              {text}
            </Text>
          </View>
        </Pressable>
      </View>
    )
  }

  return (
    <View>
      {renderSteps()}
      <View>
        {props.children?.[currentSteps]}
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center'
        }}
      >
        {renderButton('Anterior', currentSteps === 0, previousStep)}
        {renderButton(
          'Próximo',
          props.allowsNextStep,
          currentSteps === props.labels.length - 1 ? props.finish : nextSteps
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  stepContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  stepNumber: {
    borderRadius: 999,
    width: 20,
    height: 20,
    color: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    fontSize: 18,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buttonContainer: {
    marginTop: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  }
})

export default Steps
