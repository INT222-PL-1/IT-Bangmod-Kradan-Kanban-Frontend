const SERVER_URL = import.meta.env.VITE_SERVER_URL

export async function getTaskById(taskId) {
  try {
    const res = await fetch(`${SERVER_URL}/tasks/${taskId}`)
    if (res.status === 404) {
      // console.log(res)
      return null
    }
    const data = await res.json()
    // console.log(data)
    return data
  } catch (error) {
    console.error(error)
  }
}

export async function createTask({ title, description, assignees, status }) {
  try {
    const res = await fetch(`${SERVER_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description: description === '' ? null : description,
        assignees: assignees === '' ? null : assignees,
        status
      })
    })

    if (res.ok) {
      const data = await res.json()
      return data
    } else return null
  } catch (error) {
    console.error(error)
  }
}
