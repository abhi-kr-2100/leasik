import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./routes/App";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Logout from "./routes/Logout";
import SentenceListPlay from "./routes/SentenceListPlay";
import BookmarksPlay from "./routes/BookmarksPlay";
import SentenceLists from "./routes/SentenceLists";

render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<Home />} />
                <Route path="/login" element={<Login redirectURL="/lists" />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/lists" element={<SentenceLists />} />
                <Route path="/lists/:listId" element={<SentenceListPlay />} />
                <Route
                    path="/lists/:listId/bookmarks"
                    element={<BookmarksPlay />}
                />
                <Route path="*" element={<p>404</p>} />
            </Route>
        </Routes>
    </BrowserRouter>,
    document.getElementById("root")
);
