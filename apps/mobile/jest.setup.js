require('@testing-library/react-native/extend-expect')

// React Navigation não roda fora de um NavigationContainer. As telas recebem
// `navigation` por prop, então os testes passam um dublê próprio; o que
// precisa de dublê global são os hooks do pacote.
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    replace: jest.fn(),
    goBack: jest.fn(),
  }),
}))
