import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StyleSheet, Text, View } from 'react-native'
import Home from './Home'
import Scheduling from './Scheduling'
import User from './User'
import Icon from '../components/common/Icon'

const Tab = createBottomTabNavigator()

const Main = () => {
  function tab(name: string, component: any, label: string, icon: string) {
    return (
      <Tab.Screen
        name={name}
        component={component}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabScreen}>
              <Icon
                nameIcon={icon as any}
                size={24}
                color={focused ? '#29a7e4' : '#9da2ae'}
              />
              <Text style={{ ...styles.tabScreenText, color: focused ? '#29a7ea' : '#9da2ae' }}>
                {label}
              </Text>
            </View>
          )
        }}
      />
    )
  }

  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveBackgroundColor: '#222',
        tabBarInactiveBackgroundColor: '#222',
        tabBarStyle: {
          backgroundColor: '#222',
        }
      }}
    >
      {tab('Home', Home, 'Inicio', 'home-outline')}
      {tab('Scheduling', Scheduling, 'Agendamento', 'calendar-outline')}
      {tab('User', User, 'Usuário', 'perso-outline')}
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  tabScreen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  tabScreenText: {
    fontSize: 10,
  },
})

export default Main
