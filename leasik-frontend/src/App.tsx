import { Outlet } from "react-router-dom";

import NavBar from "./components/NavBar";

export default function App() {
  return (
    <div className="h-screen">
      <div className="h-[10vh]">
        <NavBar />
      </div>
      <div className="h-[90vh]">
        <Outlet />
      </div>
    </div>
  );
}
