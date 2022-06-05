export default function NavBar() {
  return (
    <nav className="h-[10%] px-5 bg-emerald-400 py-3">
      <ul className="flex gap-x-1">
        <li className="text-white hover:bg-emerald-600 rounded">
          <a href="/" className="block py-2 px-2 mx-1">
            Home
          </a>
        </li>
        <li className="text-white hover:bg-emerald-600 rounded">
          <a href="/lists" className="block py-2 px-2 mx-1">
            Lists
          </a>
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
          <a href="/login" className="block py-2 px-2 mx-1">
            Login
          </a>
        </li>
      </ul>
    </nav>
  );
}
