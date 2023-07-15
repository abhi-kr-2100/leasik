import { useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../utilities/contexts";

export default function NavBar() {
  const { token } = useContext(AuthContext);

  return (
    <nav className="h-full bg-emerald-400">
      <ul className="h-full flex">
        <li className="text-white hover:bg-emerald-600">
          <Link
            to="/"
            className="h-full flex flex-col justify-center py-2 px-2"
          >
            Home
          </Link>
        </li>
        <li className="text-white hover:bg-emerald-600">
          <Link
            to="/books"
            className="h-full flex flex-col justify-center py-2 px-2"
          >
            Books
          </Link>
        </li>
        <li className="text-white hover:bg-emerald-600 ml-auto">
          <Link
            to={token !== null ? "/logout" : "/login"}
            className="h-full flex flex-col justify-center py-2 px-2"
          >
            {token !== null ? "Logout" : "Login"}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
