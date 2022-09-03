import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utilities/contexts";

export default function LogoutController() {
    const { setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    setToken(null);
    localStorage.removeItem("token");
    navigate("/");

    return <></>
}
