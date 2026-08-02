import { useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Persistência local do app. Diferente da web, o React Native não tem
 * `window.localStorage` — a API equivalente é o AsyncStorage, e ela é
 * assíncrona, então `get` e `set` devolvem Promise.
 */
const useStorage = () => {
  const get = useCallback(async (key: string) => {
    try {
      const valorLocal = await AsyncStorage.getItem(key)
      return valorLocal ? JSON.parse(valorLocal) : null
    } catch (error) {
      // Conteúdo corrompido não deve derrubar o carregamento da sessão.
      console.error(`Falha ao ler "${key}" do storage`, error)
      return null
    }
  }, [])

  const set = useCallback(async (key: string, value: any) => {
    try {
      if (value === null || value === undefined) {
        await AsyncStorage.removeItem(key)
        return
      }
      await AsyncStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Falha ao gravar "${key}" no storage`, error)
    }
  }, [])

  return { get, set }
}

export default useStorage
