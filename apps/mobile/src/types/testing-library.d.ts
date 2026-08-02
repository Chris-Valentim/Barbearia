// Registra os matchers do Testing Library (toBeOnTheScreen, toHaveTextContent…)
// no namespace do jest. O import em jest.setup.js instala os matchers em
// runtime, mas o TypeScript só os enxerga com esta referência.
import '@testing-library/react-native/extend-expect'
