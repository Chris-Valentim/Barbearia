import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import useUser from '../data/hooks/useUser'
import Register from '../screens/Register'
import Main from '../screens/Main'
import Summary from '../screens/Summary'

const Stack = createNativeStackNavigator()

/**
 * Stack raiz do app. As telas internas (Home, Scheduling, User) não entram
 * aqui — elas vivem no bottom tab navigator, em screens/Main.tsx.
 */
const RootNavigator = () => {
  const { loading, user } = useUser()

  // A sessão vem do AsyncStorage, que é assíncrono. Montar o navigator antes
  // de a leitura terminar faz a tela de cadastro aparecer em todo cold start,
  // mesmo para quem já está logado.
  if (loading) {
    return (
      <View style={styles.carregando}>
        <ActivityIndicator size='large' color='#22c55e' />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? 'Main' : 'Register'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name='Register' component={Register} />
        <Stack.Screen name='Main' component={Main} />
        <Stack.Screen name='Summary' component={Summary} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  carregando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
})

export default RootNavigator
