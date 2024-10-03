import zyos from 'zyos'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const VERSION = 'v3'
const BASE_URL = `${SERVER_URL}/${VERSION}/boards`

/**
 * Get all statuses in a board
 * @param {string} boardId
 * @returns
 */
export async function getStatuses(boardId, zyosOptions) {
  const url = `${BASE_URL}/${boardId}/statuses`

  try {
    const res = await zyos.fetch(url, zyosOptions)
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}

/**
 * Get status by id
 * @param {Number} statusId
 * @param {Number} boardId
 * @returns
 */
export async function getStatusById(statusId, boardId, zyosOptions) {
  const url = `${BASE_URL}/${boardId}/statuses/${statusId}`

  try {
    const res = await zyos.fetch(url, {
      computeFunction: (data) => {
        for (const key in data) {
          if (data[key] === null) data[key] = ''
        }
        return data
      },
      ...zyosOptions
    })
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function createStatus({ name, description, color }, boardId, zyosOptions) {
  const url = `${BASE_URL}/${boardId}/statuses`

  try {
    const res = await zyos.fetch(url, {
      method: 'POST',
      body: {
        name,
        description: description === '' ? null : description,
        color: color === '' ? '#666666' : color
      },
      ...zyosOptions
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
}, boardId, zyosOptions) {
  const url = `${BASE_URL}/${boardId}/statuses/${statusId}`

  try {
    const res = await zyos.fetch(url, {
      method: 'PUT',
      body: {
        name,
        description: description === '' ? null : description,
        color: color === '' ? '#999999' : color,
      },
      ...zyosOptions
    })
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function deleteStatus(statusId, boardId) {
  const url = `${BASE_URL}/${boardId}/statuses/${statusId}`

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

export async function deleteStatusAndTransferTasks(fromStatusId, toStatusId, boardId) {
  const url = `${BASE_URL}/${boardId}/statuses/${fromStatusId}/${toStatusId}`

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
