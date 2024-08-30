import zyos from 'zyos'

const SERVER_URL = import.meta.env.VITE_SERVER_URL

/**
 * Get all statuses
 * @param {Object} options
 * @param {Number} options.count
 * @returns
 */
export async function getStatuses() {
  const url = `${SERVER_URL}/v2/statuses`

  try {
    const res = await zyos.fetch(url, { useToken: true })
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}

/**
 * Get status by id
 * @param {Number} statusId
 * @returns
 */
export async function getStatusById(statusId) {
  const url = `${SERVER_URL}/v2/statuses/${statusId}`

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

export async function createStatus({ name, description, color }) {
  const url = `${SERVER_URL}/v2/statuses`

  try {
    const res = await zyos.fetch(url, {
      method: 'POST',
      body: {
        name,
        description: description === '' ? null : description,
        color: color === '' ? '#666666' : color
      },
      useToken: true
    })
    return res
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
  const url = `${SERVER_URL}/v2/statuses/${statusId}`

  try {
    const res = await zyos.fetch(url, {
      method: 'PUT',
      body: {
        name,
        description: description === '' ? null : description,
        color: color === '' ? '#999999' : color,
        is_limited_status,
        maximum_limit
      },
      useToken: true
    })
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function deleteStatus(statusId) {
  const url = `${SERVER_URL}/v2/statuses/${statusId}`

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

export async function deleteStatusAndTransferTasks(fromStatusId, toStatusId) {
  const url = `${SERVER_URL}/v2/statuses/${fromStatusId}/${toStatusId}`

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
