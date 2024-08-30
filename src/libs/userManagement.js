import zyos from "zyos"

const SERVER_URL = import.meta.env.VITE_SERVER_URL

export async function login(username, password) {
    const url = `${SERVER_URL}/login`

    try {
        const res = await zyos.fetch(url, {
            method: 'POST',
            body: {
                userName: username,
                password
            }
        })
        return res
    } catch (error) {
        console.error(error)
    }
}
