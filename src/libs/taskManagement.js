const SERVER_URL = import.meta.env.VITE_SERVER_URL

export async function getTaskById(taskId) {
  try {
    const res = await fetch(`${SERVER_URL}/tasks/${taskId}`)
    if (res.status === 404) {
      // console.log(res)
      return null
    }
    return await res.json()
  } catch (error) {
    console.error(error)
  }
}
