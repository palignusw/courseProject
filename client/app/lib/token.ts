export const ACCESS_TOKEN_KEY = 'access_token'

export function setToken(token: string, rememberMe: boolean = false) {
	if (rememberMe) {
		localStorage.setItem(ACCESS_TOKEN_KEY, token)
	} else {
		sessionStorage.setItem(ACCESS_TOKEN_KEY, token)
	}
}

export function getToken(): string | null {
	return (
		localStorage.getItem(ACCESS_TOKEN_KEY) ||
		sessionStorage.getItem(ACCESS_TOKEN_KEY)
	)
}

export function removeToken() {
	localStorage.removeItem(ACCESS_TOKEN_KEY)
	sessionStorage.removeItem(ACCESS_TOKEN_KEY)
}
