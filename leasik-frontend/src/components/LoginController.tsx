import { useContext, useState } from "react";
import { useMutation } from "@apollo/client";

import { GET_JWT_TOKEN } from "../utilities/queries";
import Login from "./Login";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utilities/contexts";

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

  return (
    <Login
      setUsername={setUsername}
      setPassword={setPassword}
      onLogin={login}
    />
  );
}
