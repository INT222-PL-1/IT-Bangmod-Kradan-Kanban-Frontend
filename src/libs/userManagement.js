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

export async function refreshAccessToken(refreshToken) {
    const url = `${SERVER_URL}/token`

    console.log('Refreshing access token')
    
    try {
        const res = await zyos.fetch(url, {
            method: 'POST',
            headers: {
                'x-refresh-token': refreshToken
            },
            useToken: false,
            // credentials: 'include',
        })
        return res
    }
    catch (error) {
        console.error(error)
    }
}

/**
 * This function is used to validate access token.
 * @returns {Promise<boolean>} Returns true if the access token is valid, otherwise false.
 */
export async function validateAccessToken(accessToken) {
    console.log('Validating access token', accessToken)
    try {
        const res = await zyos.fetch(`${SERVER_URL}/token/validate`, { retry: 5, timeout: 1000, noGlobalResponseHandling: true, token: `Bearer ${accessToken}` })

        console.log(res)

        if (res.status === 'success') {
            return true
        } else {
            throw new Error(res.data.type)
        }
    } catch (error) {
        console.error(error)
        return false
    }
}
