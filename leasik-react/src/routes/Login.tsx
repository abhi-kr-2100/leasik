import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PubSub from "pubsub-js";

import { getTokenFromCredentials } from "../utilities/apiCalls";
import { setToken } from "../utilities/authentication";

interface ILoginFormProperties {
    setUsername: (newUsername: string) => any;
    setPassword: (newPassword: string) => any;
    onSubmit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
}
function LoginForm({
    setUsername,
    setPassword,
    onSubmit,
}: ILoginFormProperties) {
    function onUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
        return setUsername(event.target.value);
    }

    function onPasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        return setPassword(event.target.value);
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

interface ILoginProperties {
    redirectURL: string;
}
export default function Login({ redirectURL }: ILoginProperties) {
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

    async function login(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) {
        event.preventDefault();

        try {
            const token = await getTokenFromCredentials(username, password);
            setToken(token);
            PubSub.publish("UserLoggedIn", token);
            navigate(redirectURL);
        } catch (error) {
            alert(`Login failed. ${error}`);
        }
    }
}
