import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PubSub from "pubsub-js";

import { getTokenFromCredentials } from "../utilities/apiCalls";
import { setToken } from "../utilities/authentication";

interface ILoginFormProps {
    setUsername: (arg0: string) => any;
    setPassword: (arg0: string) => any;
    onSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
}
function LoginForm({ setUsername, setPassword, onSubmit }: ILoginFormProps) {
    function onUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
        return setUsername(e.target.value);
    }

    function onPasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        return setPassword(e.target.value);
    }

    return (
        <form>
            <label>
                <p>Username</p>
                <input onChange={onUsernameChange} />
            </label>
            <label>
                <p>Password</p>
                <input type="password" onChange={onPasswordChange} />
            </label>

            <div>
                <button type="submit" onClick={onSubmit}>
                    Submit
                </button>
            </div>
        </form>
    );
}

interface ILoginProps {
    redirectURL: string;
}
export default function Login({ redirectURL }: ILoginProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    return (
        <LoginForm
            setUsername={setUsername}
            setPassword={setPassword}
            onSubmit={login}
        />
    );

    async function login(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();

        try {
            const token = await getTokenFromCredentials(username, password);
            setToken(token);
            PubSub.publish("UserLoggedIn", token);
            navigate(redirectURL);
        } catch (err) {
            alert(`Login failed. ${err}`);
        }
    }
}
