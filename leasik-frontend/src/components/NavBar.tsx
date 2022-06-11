import { Link } from "react-router-dom";

export default function NavBar() {
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
          <Link to="/login" className="block py-2 px-2 mx-1">
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
}
