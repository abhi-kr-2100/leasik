import { createContext } from "react";

interface AuthContextType {
    token: string | null;
    setToken: (token: string | null) => void;
}

export const authContextDefaultValue: AuthContextType = {
    token: null,
    setToken: () => { }
}

export const AuthContext = createContext(authContextDefaultValue);
