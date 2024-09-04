import zyos from 'zyos'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const VERSION = 'v3'
const BASE_URL = `${SERVER_URL}/${VERSION}/boards`

export async function getBoardById(boardId) {
  const url = `${BASE_URL}/${boardId}`

  try {
    const res = await zyos.fetch(url)
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getBoards() {
  const url = `${BASE_URL}`

  try {
    const res = await zyos.fetch(url)
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function patchBoard(boardId, patchData) {
  const url = `${BASE_URL}/${boardId}/maximum-task`

  try {
    const res = await zyos.fetch(url, {
      method: 'PATCH',
      body: patchData
    })
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}

export function createBoard(boardData) {
  const url = `${BASE_URL}`

  try {
    const res = zyos.fetch(url, {
      method: 'POST',
      body: boardData
    })
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}