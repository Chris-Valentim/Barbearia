import { useCallback } from 'react'

const URL_BASE = process.env.NEXT_PUBLIC_URL_BASE

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

  const httpPost = useCallback(async function (
    uri: string,
    body: any,
  ): Promise<any> {
    try {
      const res = await fetch(`${URL_BASE}/${uri}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        console.error(`POST ${uri} respondeu ${res.status}`)
        return null
      }

      // 201 sem corpo é resposta válida para criação.
      const texto = await res.text()
      return texto ? JSON.parse(texto) : null
    } catch (error) {
      console.error(error)
      return null
    }
  }, [])

  return { httpGet, httpPost }
}

export default useAPI
