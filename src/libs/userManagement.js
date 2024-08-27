import { ResponseObject } from "./classes/ResponseObject"

const SERVER_URL = import.meta.env.VITE_SERVER_URL

export async function login(username, password) {
    const url = `${SERVER_URL}/login`

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: username,
                password
            })
        })

        let data
        try {
            data = await res.json()
        } catch (error) {
            console.error('Error while parsing the body text as JSON.\nResponse may not have a body.')
            data = null
        }
        if (res.ok) {
            return ResponseObject.success(data, res.status)
        } else {
            return ResponseObject.error(data.message, res.status)
        }
    } catch (error) {
        console.error(error)
    }
}
