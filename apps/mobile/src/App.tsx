import { Text, View } from 'react-native'
import { somar } from '@barba/core'

const App = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>App {somar(32, 48)}</Text>
    </View>
  )
}

export default App
