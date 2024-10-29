import zyos from 'zyos'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const VERSION = 'v3'
const BASE_URL = `${SERVER_URL}/${VERSION}/boards`

/**
 * Get all tasks in a board
 * @param {string} boardId - board id
 * @param {object} options - query parameters
 * @returns 
 */
export async function getTasks(boardId, options) {
  const url = `${BASE_URL}/${boardId}/tasks`
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(options)) {
    if (value === null || value === undefined || value.length === 0) continue
    params.append(key, value)
  }

  try {
    const res = await zyos.fetch(`${url}?${params}`)
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getTaskById(taskId, boardId) {
  const url = `${BASE_URL}/${boardId}/tasks/${taskId}`

  try {
    const res = await zyos.fetch(url, {
      computeFunction: (data) => {
        for (const key in data) {
          if (data[key] === null) data[key] = ''
        }
        return data
      }
    })
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function createTask({ title, description, assignees, status, boardId }) {
  const url = `${BASE_URL}/${boardId}/tasks`

  try {
    const res = await zyos.fetch(url, {
      method: 'POST',
      body: {
        title,
        description: description === '' ? null : description,
        assignees: assignees === '' ? null : assignees,
        statusId: status.id,
        boardId
      }
    })
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function updateTask({ id: taskId, title, description, assignees, status, boardId }) {
  const url = `${BASE_URL}/${boardId}/tasks/${taskId}`

  try {
    const res = await zyos.fetch(url, {
      method: 'PUT',
      body: {
        title,
        description: description === '' ? null : description,
        assignees: assignees === '' ? null : assignees,
        statusId: status.id,
        boardId
      }
    })
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function deleteTask(taskId, boardId) {
  const url = `${BASE_URL}/${boardId}/tasks/${taskId}`

  try {
    const res = await zyos.fetch(url, {
      method: 'DELETE'
    })
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}
