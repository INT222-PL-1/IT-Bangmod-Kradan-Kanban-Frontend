import zyos from "zyos"

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const VERSION = 'v3'
const BASE_URL = `${SERVER_URL}/${VERSION}/boards`

export async function getCollaborators(boardId) {
  const url = `${BASE_URL}/${boardId}/collabs`

  try {
    const res = await zyos.fetch(url)
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function addCollaborator(boardId, { email, accessRight }, zyosOptions) {
  const url = `${BASE_URL}/${boardId}/collabs`

  try {
    const res = await zyos.fetch(url, {
      method: 'POST',
      body: { email, accessRight },
      ...zyosOptions
    })
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function removeCollaborator(boardId, collaboratorId, zyosOptions) {
  const url = `${BASE_URL}/${boardId}/collabs/${collaboratorId}`

  try {
    const res = await zyos.fetch(url, {
      method: 'DELETE',
      ...zyosOptions
    })
    return res
  } catch (error) {
    console.error(error)
    return null
  }
}