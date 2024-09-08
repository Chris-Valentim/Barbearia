import { useCallback } from "react"

const URL_BASE = process.env.NEXT_PUBLIC_URL_BASE 

const useAPI = () => {
  const httpGet = useCallback(async function (uri: string): Promise<any> {
    try {
      const res = await fetch(`${URL_BASE}/${uri}`)
      const date = await res.json()
      return date
    } catch (error) {
      console.error(error)
    }
  }, [])

  const httpPost = useCallback(async function (uri: string, body: any): Promise<any> {
    await fetch(`${URL_BASE}/${uri}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  }, [])

  return { httpGet, httpPost}
}

export default useAPI
