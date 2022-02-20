export function getToken() {
    return sessionStorage.getItem("token");
}

export function setToken(token: string | null) {
    if (token === null) {
        sessionStorage.removeItem("token");
        return;
    }

    sessionStorage.setItem("token", token);
}
