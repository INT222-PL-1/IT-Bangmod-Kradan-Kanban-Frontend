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

export async function getTaskById(boardId, taskId) {
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

export async function createTask(boardId, { title, description, assignees, status }) {
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

export async function updateTask(boardId, { id: taskId, title, description, assignees, status, attachments }) {
  const url = `${BASE_URL}/${boardId}/tasks/${taskId}`

  try {
    const res = await zyos.fetch(url, {
      method: 'PUT',
      body: {
        title,
        description: description === '' ? null : description,
        assignees: assignees === '' ? null : assignees,
        statusId: status.id,
        attachments: attachments.map((attachment) => attachment.name),
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

/**
 * Upload task attachment
 * @param {string} taskId - task id
 * @param {string} boardId - board id
 * @param {File[]} files - files to upload
 */
export async function uploadTaskAttachment(taskId, boardId, files) {
  const url = `${BASE_URL}/${boardId}/tasks/${taskId}/files`

  const formData = new FormData()

  files.forEach((file) => {
    formData.append('files', file)
  })

  try {
    const res = await zyos.fetch(url, {
      method: 'POST',
      body: formData,
      timeout: 5000
    })
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}