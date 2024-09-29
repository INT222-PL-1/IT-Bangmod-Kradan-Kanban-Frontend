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
            },
            useToken: false
        })
        return res
    } catch (error) {
        console.error(error)
    }
}

export async function refreshAccessToken() {
    const url = `${SERVER_URL}/token`

    try {
        const res = await zyos.fetch(url, {
            method: 'POST',
            headers: {
                'x-refresh-token': localStorage.getItem('itbkk_refresh_token')
            },
            useToken: false,
            credentials: 'include',
        })
        return res
    }
    catch (error) {
        console.error(error)
    }
}
