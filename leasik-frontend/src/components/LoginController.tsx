import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMutation } from "@apollo/client";

import { GET_JWT_TOKEN } from "../utilities/queries";
import { AuthContext } from "../utilities/contexts";
import Login from "./Login";

export default function LoginController() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [login] = useMutation(GET_JWT_TOKEN, {
    variables: { username, password },
    onCompleted: (data) => {
      localStorage.setItem("token", data.tokenAuth.token);
      setToken(localStorage.getItem("token"));
      navigate("/");
    },
    onError: (error) => {
      alert(`Login failed: ${error.message}`);
    },
  });

  const [loginAsGuest] = useMutation(GET_JWT_TOKEN, {
    variables: { username: "guest", password: "guest" },
    onCompleted: (data) => {
      localStorage.setItem("token", data.tokenAuth.token);
      setToken(localStorage.getItem("token"));
      navigate("/");
    },
    onError: (error) => {
      alert(`Guest login failed: ${error.message}`);
    },
  });

  return (
    <Login
      setUsername={setUsername}
      setPassword={setPassword}
      onLogin={login}
      onGuestLogin={loginAsGuest}
    />
  );
}
