import { UserProvider } from './data/contexts/UserContext'
import { SchedulingProvider } from './data/contexts/SchedulingContext'
import RootNavigator from './navigation/RootNavigator'

const App = () => {
  return (
    <UserProvider>
      <SchedulingProvider>
        <RootNavigator />
      </SchedulingProvider>
    </UserProvider>
  )
}

export default App
