import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../utilities/contexts";

export default function NavBar() {
  const { token } = useContext(AuthContext);

  return (
    <nav className="h-full px-5 bg-emerald-400 py-3">
      <ul className="flex gap-x-1">
        <li className="text-white hover:bg-emerald-600 rounded">
          <Link to="/" className="block py-2 px-2 mx-1">
            Home
          </Link>
        </li>
        <li className="text-white hover:bg-emerald-600 rounded">
          <Link to="/lists" className="block py-2 px-2 mx-1">
            Lists
          </Link>
        </li>
        <li className="text-white hover:bg-emerald-600 rounded">
          <a
            href="https://github.com/abhi-kr-2100/"
            target="_blank"
            rel="noreferrer"
            className="block py-2 px-2 mx-1"
          >
            abhi-kr-2100
          </a>
        </li>
        <li className="text-white hover:bg-emerald-600 rounded ml-auto">
          <Link to={(token !== null) ? "/logout" : "/login"} className="block py-2 px-2 mx-1">
            {(token !== null) ? "Logout" : "Login"}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
