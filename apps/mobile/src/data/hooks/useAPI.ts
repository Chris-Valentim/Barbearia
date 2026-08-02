import { useCallback } from 'react'

// O Expo só injeta no bundle variáveis com o prefixo EXPO_PUBLIC_.
// NEXT_PUBLIC_ é do Next e chegava aqui sempre como undefined, fazendo toda
// requisição sair para "undefined/scheduling".
const URL_BASE = process.env.EXPO_PUBLIC_URL_BASE

const useAPI = () => {
  const httpGet = useCallback(async function (uri: string): Promise<any> {
    try {
      const res = await fetch(`${URL_BASE}/${uri}`)

      // Sem esta checagem, o corpo de um erro volta como se fosse dado válido:
      // quem esperava um array recebe { message, error, statusCode } e quebra
      // no primeiro .includes/.map.
      if (!res.ok) {
        console.error(`GET ${uri} respondeu ${res.status}`)
        return null
      }

      return await res.json()
    } catch (error) {
      console.error(error)
      return null
    }
  }, [])

  /**
   * Diferente de httpGet, LANÇA quando a requisição falha.
   *
   * A api responde 201 com corpo vazio na criação, então o valor de retorno
   * não serve para distinguir sucesso de falha — `null` significaria as duas
   * coisas ao mesmo tempo, e todo agendamento bem-sucedido seria reportado
   * como erro. Uma escrita que falha também não tem fallback razoável, ao
   * contrário de uma leitura, que pode cair para lista vazia.
   */
  const httpPost = useCallback(async function (
    uri: string,
    body: any,
  ): Promise<any> {
    const res = await fetch(`${URL_BASE}/${uri}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      throw new Error(`POST ${uri} respondeu ${res.status}`)
    }

    const texto = await res.text()
    return texto ? JSON.parse(texto) : null
  }, [])

  return { httpGet, httpPost }
}

export default useAPI
