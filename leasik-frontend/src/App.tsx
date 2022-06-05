import { Outlet } from "react-router-dom";

import NavBar from "./components/NavBar";

export default function App() {
  return (
    <div className="h-screen">
      <NavBar />
      <Outlet />
    </div>
  );
}
