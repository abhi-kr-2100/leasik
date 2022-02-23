import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import PubSub from "pubsub-js";

import { getToken } from "../utilities/authentication";

export default function App() {
    const initialUserLoggedInState = getToken() !== null;
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(
        initialUserLoggedInState
    );

    const accountLinkURL = isUserLoggedIn ? "/logout" : "/login";
    const accountLinkText = isUserLoggedIn ? "Log out" : "Log in";

    useEffect(() => {
        const unsubscribeFromUserLoggedInToken = PubSub.subscribe(
            "UserLoggedIn",
            setUserIsLoggedIn
        );
        const unsubscribeFromUserLoggedOutToken = PubSub.subscribe(
            "UserLoggedOut",
            setUserIsNotLoggedIn
        );

        function unsubscribe() {
            PubSub.unsubscribe(unsubscribeFromUserLoggedInToken);
            PubSub.unsubscribe(unsubscribeFromUserLoggedOutToken);
        }

        return unsubscribe;
    }, []);

    return (
        <div>
            <nav className="navbar is-primary">
                <div className="navbar-brand">
                    <NavLink className="navbar-item" to="/">
                        Leasik
                    </NavLink>

                    <a
                        role="button"
                        className="navbar-burger"
                        aria-label="menu"
                        aria-expanded="false"
                        data-target="navbar"
                    >
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                <div id="navbar" className="navbar-menu">
                    <div className="navbar-start is-primary">
                        <NavLink className="navbar-item" to="/">
                            Home
                        </NavLink>
                        <NavLink className="navbar-item" to="/lists">
                            Lists
                        </NavLink>
                    </div>
                    <div className="navbar-end">
                        <NavLink className="navbar-item" to={accountLinkURL}>
                            {accountLinkText}
                        </NavLink>
                    </div>
                </div>
            </nav>

            <Outlet />
        </div>
    );

    function setUserIsLoggedIn() {
        setIsUserLoggedIn(true);
    }

    function setUserIsNotLoggedIn() {
        setIsUserLoggedIn(false);
    }
}
