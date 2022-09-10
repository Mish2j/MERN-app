import { BrowserRouter, Routes, Route } from "react-router-dom";

import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";

import React from "react";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="places">
          <Route path="new" element={<NewPlace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
