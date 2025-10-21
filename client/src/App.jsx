
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./elements/Home";
import Smart from "./elements/Smart";
import Create from "./elements/Create";
import Edit from "./elements/Edit";
import Read from "./elements/Read";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/smart" element={<Smart />} />
        <Route path="/create" element={<Create />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/read/:id" element={<Read />} />
      </Routes>
    </Router>
  );
};

export default App;


