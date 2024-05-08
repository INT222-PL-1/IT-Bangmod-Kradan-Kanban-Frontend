const SERVER_URL = import.meta.env.VITE_SERVER_URL

export async function getStatuses() {
  try {
    const res = await fetch(`${SERVER_URL}/v2/statuses`)
    const data = await res.json()
    if (res.status === 500) {
      return null
    }
    return data
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getStatusById(statusId) {
  try {
    const res = await fetch(`${SERVER_URL}/v2/statuses/${statusId}`)
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

export async function createStatus({ name, description, color }) {
  try {
    const res = await fetch(`${SERVER_URL}/v2/statuses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        description: description === '' ? null : description,
        color: color === '' ? '#666666' : color
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

export async function updateStatus({ id: statusId, name, description, color }) {
  try {
    const res = await fetch(`${SERVER_URL}/v2/statuses/${statusId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        description: description === '' ? null : description,
        color: color === '' ? '#666666' : color
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

export async function deleteStatus(statusId) {
  try {
    const res = await fetch(`${SERVER_URL}/v2/statuses/${statusId}`, {
      method: 'DELETE'
    })
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
