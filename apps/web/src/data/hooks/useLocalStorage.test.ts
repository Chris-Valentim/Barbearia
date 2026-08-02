import { renderHook } from '@testing-library/react'
import useLocalStorage from './useLocalStorage'

describe('useLocalStorage.get', () => {
  beforeEach(() => window.localStorage.clear())

  it('desserializa o valor guardado', () => {
    window.localStorage.setItem('user', JSON.stringify({ name: 'Christian' }))
    const { result } = renderHook(() => useLocalStorage())

    expect(result.current.get('user')).toEqual({ name: 'Christian' })
  })

  it('devolve null para chave inexistente', () => {
    const { result } = renderHook(() => useLocalStorage())

    expect(result.current.get('nao-existe')).toBeNull()
  })

  it('preserva tipos primitivos', () => {
    window.localStorage.setItem('contador', JSON.stringify(42))
    const { result } = renderHook(() => useLocalStorage())

    expect(result.current.get('contador')).toBe(42)
  })
})

describe('useLocalStorage.set', () => {
  beforeEach(() => window.localStorage.clear())

  // BUG CONHECIDO — a implementação faz `setItem(value, JSON.stringify(key))`,
  // invertendo chave e valor. O dado é gravado sob uma chave que é o próprio
  // conteúdo, e `get` nunca o encontra de volta.
  it.failing('grava sob a chave informada', () => {
    const { result } = renderHook(() => useLocalStorage())

    result.current.set('user', { name: 'Christian' })

    expect(window.localStorage.getItem('user')).toBe(
      JSON.stringify({ name: 'Christian' }),
    )
  })

  it.failing('permite ler de volta o que foi gravado', () => {
    const { result } = renderHook(() => useLocalStorage())

    result.current.set('user', { name: 'Christian' })

    expect(result.current.get('user')).toEqual({ name: 'Christian' })
  })

  it('documenta o comportamento atual: chave e valor trocados', () => {
    const { result } = renderHook(() => useLocalStorage())

    result.current.set('user', 'christian')

    // Grava sob a chave "christian" o valor "\"user\"" — exatamente o inverso.
    expect(window.localStorage.getItem('christian')).toBe('"user"')
    expect(window.localStorage.getItem('user')).toBeNull()
  })
})
