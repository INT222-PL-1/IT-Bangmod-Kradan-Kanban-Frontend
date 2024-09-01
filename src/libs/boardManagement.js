import zyos from 'zyos'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const VERSION = 'v3'

const BOARD_URL = `${SERVER_URL}/${VERSION}/boards`

export async function getBoardById(boardId) {
  const url = `${BOARD_URL}/${boardId}`

  try {
    const res = await zyos.fetch(url, { useToken: true })
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getBoards() {
  const url = `${BOARD_URL}`

  try {
    const res = await zyos.fetch(url, { useToken: true })
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function patchBoard(boardId, patchData) {
  const url = `${BOARD_URL}/${boardId}/maximum-task`

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

export async function getTasks(boardId, options) {
  const url = `${SERVER_URL}/${VERSION}/boards/${boardId}/tasks`
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(options)) {
    if (value === null || value === undefined || value.length === 0) continue
    params.append(key, value)
  }

  try {
    const res = await zyos.fetch(`${url}?${params}`, { useToken: true })
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}