import zyos from 'zyos'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

export async function getTasks(options = {}) {
  const url = `${SERVER_URL}/v2/tasks`
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

export async function getTaskById(taskId) {
  const url = `${SERVER_URL}/v2/tasks/${taskId}`

  try {
    const res = await zyos.fetch(url, {
      computeFunction: (data) => {
        for (const key in data) {
          if (data[key] === null) data[key] = ''
        }
        return data
      },
      useToken: true
    })
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function createTask({ title, description, assignees, status, boardId }) {
  const url = `${SERVER_URL}/v2/tasks`

  try {
    const res = await zyos.fetch(url, {
      method: 'POST',
      body: {
        title,
        description: description === '' ? null : description,
        assignees: assignees === '' ? null : assignees,
        statusId: status.id,
        boardId
      },
      useToken: true
    })
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function updateTask({ id: taskId, title, description, assignees, status, boardId }) {
  const url = `${SERVER_URL}/v2/tasks/${taskId}`

  try {
    const res = await zyos.fetch(url, {
      method: 'PUT',
      body: {
        title,
        description: description === '' ? null : description,
        assignees: assignees === '' ? null : assignees,
        statusId: status.id,
        boardId
      },
      useToken: true
    })
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function deleteTask(taskId) {
  const url = `${SERVER_URL}/v2/tasks/${taskId}`

  try {
    const res = await zyos.fetch(url, {
      method: 'DELETE',
      useToken: true
    })
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}
