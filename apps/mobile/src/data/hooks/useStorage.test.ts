import { renderHook } from '@testing-library/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import useStorage from './useStorage'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}))

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>

describe('useStorage.set', () => {
  beforeEach(() => jest.clearAllMocks())

  it('grava sob a chave informada, serializando o valor', async () => {
    const { result } = renderHook(() => useStorage())

    await result.current.set('user', { name: 'Christian' })

    expect(mockAsyncStorage.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify({ name: 'Christian' }),
    )
  })

  it('remove a chave em vez de gravar quando o valor é null', async () => {
    const { result } = renderHook(() => useStorage())

    await result.current.set('user', null)

    expect(mockAsyncStorage.removeItem).toHaveBeenCalledWith('user')
    expect(mockAsyncStorage.setItem).not.toHaveBeenCalled()
  })

  it('não lança quando o storage falha', async () => {
    mockAsyncStorage.setItem.mockRejectedValueOnce(new Error('disco cheio'))
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const { result } = renderHook(() => useStorage())

    await expect(
      result.current.set('user', { name: 'X' }),
    ).resolves.toBeUndefined()
  })
})

describe('useStorage.get', () => {
  beforeEach(() => jest.clearAllMocks())

  it('desserializa o valor guardado', async () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce(
      JSON.stringify({ name: 'Christian' }),
    )
    const { result } = renderHook(() => useStorage())

    expect(await result.current.get('user')).toEqual({ name: 'Christian' })
  })

  it('devolve null para chave inexistente', async () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce(null)
    const { result } = renderHook(() => useStorage())

    expect(await result.current.get('user')).toBeNull()
  })

  it('devolve null quando o conteúdo não é JSON válido', async () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce('{corrompido')
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const { result } = renderHook(() => useStorage())

    expect(await result.current.get('user')).toBeNull()
  })

  it('usa AsyncStorage, não window.localStorage', async () => {
    mockAsyncStorage.getItem.mockResolvedValueOnce(null)
    const { result } = renderHook(() => useStorage())

    await result.current.get('user')

    // Regressão: o hook usava window.localStorage, que não existe em RN.
    expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('user')
  })
})
