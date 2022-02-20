import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import PubSub from "pubsub-js";

export default function App() {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

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
                <div className="navbar-brand is-primary">
                    <NavLink className="navbar-item" to="/">
                        Home
                    </NavLink>
                    <NavLink className="navbar-item" to="/lists">
                        Lists
                    </NavLink>
                    <NavLink className="navbar-item" to={accountLinkURL}>
                        {accountLinkText}
                    </NavLink>
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
