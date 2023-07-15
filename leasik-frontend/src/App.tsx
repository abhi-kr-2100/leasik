import { useState } from "react";
import { Outlet } from "react-router-dom";

import NavBar from "./components/NavBar";

import { AuthContext } from "./utilities/contexts";

export default function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));

  return (
    <AuthContext.Provider value={{ token: authToken, setToken: setAuthToken }}>
      <div className="h-[10vh]">
        <NavBar />
      </div>
      <div className="h-[90vh]">
        <Outlet />
      </div>
    </AuthContext.Provider>
  );
}
