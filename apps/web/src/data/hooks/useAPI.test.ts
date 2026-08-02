import { renderHook } from '@testing-library/react'
import useAPI from './useAPI'

const fetchMock = jest.fn()
global.fetch = fetchMock as unknown as typeof fetch

function respostaOk(body: unknown) {
  return { ok: true, status: 200, json: async () => body }
}

function resposta404() {
  return {
    ok: false,
    status: 404,
    json: async () => ({
      message: 'Cannot GET /scheduling/busy/1/2026-08-05',
      error: 'Not Found',
      statusCode: 404,
    }),
  }
}

describe('useAPI.httpGet', () => {
  beforeEach(() => fetchMock.mockReset())

  it('devolve o corpo desserializado', async () => {
    fetchMock.mockResolvedValue(respostaOk(['08:00', '08:15']))
    const { result } = renderHook(() => useAPI())

    expect(
      await result.current.httpGet('scheduling/busy/1/2026-08-05'),
    ).toEqual(['08:00', '08:15'])
  })

  it('monta a URL a partir da base de ambiente', async () => {
    fetchMock.mockResolvedValue(respostaOk([]))
    const { result } = renderHook(() => useAPI())

    await result.current.httpGet('service')

    expect(fetchMock.mock.calls[0][0]).toContain('/service')
  })

  it('não lança quando o fetch falha', async () => {
    fetchMock.mockRejectedValue(new Error('rede indisponível'))
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const { result } = renderHook(() => useAPI())

    await expect(result.current.httpGet('service')).resolves.toBeNull()
  })

  // Regressão do erro "busySchedules.includes is not a function": sem checar
  // res.ok, o corpo do 404 voltava como dado válido e o componente recebia um
  // objeto onde esperava um array.
  it('não devolve o corpo de uma resposta de erro', async () => {
    fetchMock.mockResolvedValue(resposta404())
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const { result } = renderHook(() => useAPI())

    const retorno = await result.current.httpGet('scheduling/busy/1/2026-08-05')

    // null em vez do corpo do erro — nada de statusCode vazando como dado.
    expect(retorno).toBeNull()
  })

  it('devolve algo que o consumidor pode tratar com ?? []', async () => {
    fetchMock.mockResolvedValue(resposta404())
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const { result } = renderHook(() => useAPI())

    const retorno = await result.current.httpGet('scheduling/busy/1/2026-08-05')

    // É este contrato que o SchedulingContext assume ao fazer `busy ?? []`.
    expect(retorno ?? []).toEqual([])
  })

  it('registra o status recebido ao falhar', async () => {
    fetchMock.mockResolvedValue(resposta404())
    const erro = jest.spyOn(console, 'error').mockImplementation(() => {})
    const { result } = renderHook(() => useAPI())

    await result.current.httpGet('scheduling/busy/1/2026-08-05')

    expect(erro).toHaveBeenCalledWith(expect.stringContaining('404'))
  })
})

describe('useAPI.httpPost', () => {
  beforeEach(() => fetchMock.mockReset())

  it('envia o método POST', async () => {
    fetchMock.mockResolvedValue(respostaOk({}))
    const { result } = renderHook(() => useAPI())

    await result.current.httpPost('scheduling', { emailClient: 'a@b.com' })

    expect(fetchMock.mock.calls[0][1].method).toBe('POST')
  })

  it('declara o content-type JSON', async () => {
    fetchMock.mockResolvedValue(respostaOk({}))
    const { result } = renderHook(() => useAPI())

    await result.current.httpPost('scheduling', {})

    expect(fetchMock.mock.calls[0][1].headers['Content-Type']).toBe(
      'application/json',
    )
  })

  it('serializa o corpo enviado', async () => {
    fetchMock.mockResolvedValue(respostaOk({}))
    const { result } = renderHook(() => useAPI())

    await result.current.httpPost('scheduling', { emailClient: 'a@b.com' })

    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      emailClient: 'a@b.com',
    })
  })
})
