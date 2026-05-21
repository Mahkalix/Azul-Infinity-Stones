import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Rules from "./pages/Rules/Rules";
import Game from "./pages/Game/Game";
import SocketDemo from "./pages/SocketDemo/SocketDemo";

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/socket" element={<SocketDemo />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
