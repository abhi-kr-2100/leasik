import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PubSub from "pubsub-js";
import { setToken } from "../utilities/authentication";

export default function Logout() {
    const navigateTo = useNavigate();

    setToken(null);
    PubSub.publish("UserLoggedOut");

    useEffect(() => {
        navigateTo("/login");
    });

    // this is never reached
    return <></>;
}
