export function getToken() {
    return sessionStorage.getItem("token")
}

export function setToken(token: string) {
    sessionStorage.setItem("token", token)
}
