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

  // Regressão: a implementação fazia `setItem(value, JSON.stringify(key))`,
  // gravando sob uma chave que era o próprio conteúdo. Nada do que era
  // gravado podia ser lido de volta — a sessão se perdia a cada reload.
  it('grava sob a chave informada', () => {
    const { result } = renderHook(() => useLocalStorage())

    result.current.set('user', { name: 'Christian' })

    expect(window.localStorage.getItem('user')).toBe(
      JSON.stringify({ name: 'Christian' }),
    )
  })

  it('permite ler de volta o que foi gravado', () => {
    const { result } = renderHook(() => useLocalStorage())

    result.current.set('user', { name: 'Christian' })

    expect(result.current.get('user')).toEqual({ name: 'Christian' })
  })

  it('não cria chave com o conteúdo do valor', () => {
    const { result } = renderHook(() => useLocalStorage())

    result.current.set('user', 'christian')

    expect(window.localStorage.getItem('christian')).toBeNull()
    expect(result.current.get('user')).toBe('christian')
  })

  it('sobrescreve o valor anterior da mesma chave', () => {
    const { result } = renderHook(() => useLocalStorage())

    result.current.set('user', { name: 'Primeiro' })
    result.current.set('user', { name: 'Segundo' })

    expect(result.current.get('user')).toEqual({ name: 'Segundo' })
  })

  it('faz ida e volta de null sem quebrar', () => {
    const { result } = renderHook(() => useLocalStorage())

    result.current.set('user', { name: 'Christian' })
    result.current.set('user', null)

    expect(result.current.get('user')).toBeNull()
  })
})

describe('useLocalStorage — robustez', () => {
  beforeEach(() => window.localStorage.clear())

  it('devolve null quando o conteúdo guardado não é JSON válido', () => {
    window.localStorage.setItem('user', '{corrompido')
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const { result } = renderHook(() => useLocalStorage())

    expect(result.current.get('user')).toBeNull()
  })
})
