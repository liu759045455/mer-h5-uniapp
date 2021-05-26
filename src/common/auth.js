const Key = 'token'
export function getToken() {
	return sessionStorage.getItem(Key)
}
export function setToken() {
	return sessionStorage.setItem(Key)
}
export function removeToken() {
	return sessionStorage.removeItem(Key)
}
