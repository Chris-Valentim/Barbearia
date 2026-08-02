import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import Register from '../screens/Register'
import Main from '../screens/Main'
import Summary from '../screens/Summary'

const Stack = createNativeStackNavigator()

/**
 * Stack raiz do app. As telas internas (Home, Scheduling, User) não entram
 * aqui — elas vivem no bottom tab navigator, em screens/Main.tsx.
 */
const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Register' component={Register} />
        <Stack.Screen name='Main' component={Main} />
        <Stack.Screen name='Summary' component={Summary} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default RootNavigator
