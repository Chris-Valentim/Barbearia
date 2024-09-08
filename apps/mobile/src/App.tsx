import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { UserTaster } from './data/contexts/UserContext'
import { SchedulingProvider } from './data/contexts/SchedulingContext'
import { NavigationContainer } from '@react-navigation/native'
import Register from './screens/Register'
import Main from './screens/Main'
import Summary from './screens/Summary'

const Stack = createNativeStackNavigator()

const App = () => {
  return (
    <UserTaster>
      <SchedulingProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name='Cadastro'
              component={Register}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name='Principal'
              component={Main}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name='Sumario'
              component={Summary}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SchedulingProvider>
    </UserTaster>
  )
}

export default App
