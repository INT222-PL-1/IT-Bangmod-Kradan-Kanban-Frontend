const SERVER_URL = import.meta.env.VITE_SERVER_URL

export async function getTasks(options = {}) {
  const url = `${SERVER_URL}/v2/tasks`
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(options)) {
    if (value === null || value === undefined || value.length === 0) continue
    params.append(key, value)
  }

  try {
    const res = await fetch(`${url}?${params}`)
    if (res.status === 404) {
      return null
    }
    const data = await res.json()
    for (const key in data) {
      if (data[key] === null) data[key] = ''
    }
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getTaskById(taskId) {
  try {
    const res = await fetch(`${SERVER_URL}/v2/tasks/${taskId}`)
    if (res.status === 404) {
      // console.log(res)
      return null
    }
    const data = await res.json()
    // console.log(data)
    for (const key in data) {
      if (data[key] === null) data[key] = ''
    }
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function createTask({ title, description, assignees, status, boardId }) {
  try {
    const res = await fetch(`${SERVER_URL}/v2/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description: description === '' ? null : description,
        assignees: assignees === '' ? null : assignees,
        statusId: status.id,
        boardId
      })
    })

    if (res.ok) {
      const data = await res.json()
      return data
    } else return null
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function updateTask({ id: taskId, title, description, assignees, status, boardId }) {
  try {
    const res = await fetch(`${SERVER_URL}/v2/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description: description === '' ? null : description,
        assignees: assignees === '' ? null : assignees,
        statusId: status.id,
        boardId
      })
    })

    if (res.ok) {
      const data = await res.json()
      return data
    } else return null
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function deleteTask(taskId) {
  try {
    const res = await fetch(`${SERVER_URL}/v2/tasks/${taskId}`, { method: 'DELETE' })
    if (res.ok) {
      const data = await res.json()
      return data
    } else if (res.status === 404) {
      return { errorStatus: res.status }
    } else return null
  } catch (error) {
    console.error(error)
    return null
  }
}
