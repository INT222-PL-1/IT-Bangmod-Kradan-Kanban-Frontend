import zyos from 'zyos'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

export async function getBoardById(boardId) {
  const url = `${SERVER_URL}/v2/boards/${boardId}`

  try {
    const res = await zyos.fetch(url, { useToken: true })
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getBoards() {
  const url = `${SERVER_URL}/v2/boards`

  try {
    const res = await zyos.fetch(url, { useToken: true })
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function patchBoard(boardId, patchData) {
  const url = `${SERVER_URL}/v2/boards/${boardId}/maximum-task`

  try {
    const res = await zyos.fetch(url, {
      method: 'PATCH',
      body: patchData,
      useToken: true
    })
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}
