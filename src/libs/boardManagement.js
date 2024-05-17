const SERVER_URL = import.meta.env.VITE_SERVER_URL

export async function getBoardById(boardId) {
  try {
    const res = await fetch(`${SERVER_URL}/v2/boards/${boardId}`)
    if (res.status === 404) {
      return null
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}
