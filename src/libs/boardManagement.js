import { ResponseObject } from './classes/ResponseObject'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

export async function getBoardById(boardId) {
  try {
    const res = await fetch(`${SERVER_URL}/v2/boards/${boardId}`)
    if (res.status === 404) {
      return null
    }

    const data = await res.json()

    if (res.ok) {
      return ResponseObject.success(data)
    } else {
      return ResponseObject.error(data.message)
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getBoards() {
  try {
    const res = await fetch(`${SERVER_URL}/v2/boards`)
    const data = await res.json()

    if (res.ok) {
      return ResponseObject.success(data)
    } else {
      return ResponseObject.error(data.message)
    }
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function patchBoard(boardId, patchData) {
  try {
    const res = await fetch(`${SERVER_URL}/v2/boards/${boardId}/maximum-task`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(patchData)
    })

    const data = await res.json()

    if (res.ok) {
      return ResponseObject.success(data)
    } else {
      return ResponseObject.error(data.message)
    }
  } catch (error) {
    console.error(error)
    return null
  }
}
