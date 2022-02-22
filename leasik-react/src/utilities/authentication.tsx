export function getToken() {
    return localStorage.getItem("token");
}

export function setToken(token: string | null) {
    if (token === null) {
        localStorage.removeItem("token");
        return;
    }

    localStorage.setItem("token", token);
}
