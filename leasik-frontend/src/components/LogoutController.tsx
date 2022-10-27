import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../utilities/contexts";

export default function LogoutController() {
    const { setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        setToken(null);
        localStorage.removeItem("token");
        navigate("/");
    }, [navigate, setToken]);

    return <></>
}
