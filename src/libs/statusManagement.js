import { ResponseObject } from './classes/ResponseObject'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

/**
 * Get all statuses
 * @param {Object} options
 * @param {Number} options.count
 * @returns
 */
export async function getStatuses(options = {}) {
  let url = `${SERVER_URL}/v2/statuses`

  if (options.count) url += `?count=${options.count}`

  try {
    const res = await fetch(url)
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

/**
 * Get status by id
 * @param {Number} statusId
 * @param {Object} options
 * @param {Number} options.count
 * @returns
 */
export async function getStatusById(statusId, options = {}) {
  let url = `${SERVER_URL}/v2/statuses/${statusId}`

  if (options.count) url += `?count=${options.count}`

  try {
    const res = await fetch(url)
    if (res.status === 404) {
      // console.log(res)
      return null
    }
    const data = await res.json()

    if (res.ok) {
      for (const key in data) {
        if (data[key] === null) data[key] = ''
      }
      return ResponseObject.success(data)
    } else {
      return ResponseObject.error(data.message)
    }
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

export async function updateStatus({
  id: statusId,
  name,
  description,
  color,
  is_limited_status,
  maximum_limit
}) {
  try {
    const res = await fetch(`${SERVER_URL}/v2/statuses/${statusId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        description: description === '' ? null : description,
        color: color === '' ? '#666666' : color,
        is_limited_status,
        maximum_limit
      })
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

export async function deleteStatus(statusId) {
  try {
    const res = await fetch(`${SERVER_URL}/v2/statuses/${statusId}`, {
      method: 'DELETE'
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

export async function deleteStatusAndTransferTasks(fromStatusId, toStatusId) {
  try {
    const res = await fetch(`${SERVER_URL}/v2/statuses/${fromStatusId}/${toStatusId}`, {
      method: 'DELETE'
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
