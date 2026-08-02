'use client'
import { useCallback } from 'react'

const useLocalStorage = () => {
  const get = useCallback((key: string) => {
    if (typeof window === 'undefined') return null

    try {
      const valorLocal = window.localStorage.getItem(key)
      return valorLocal ? JSON.parse(valorLocal) : null
    } catch (error) {
      // Conteúdo corrompido não deve derrubar o carregamento da sessão.
      console.error(`Falha ao ler "${key}" do localStorage`, error)
      return null
    }
  }, [])

  const set = useCallback((key: string, value: any) => {
    if (typeof window === 'undefined') return

    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Falha ao gravar "${key}" no localStorage`, error)
    }
  }, [])

  return { get, set }
}

export default useLocalStorage
