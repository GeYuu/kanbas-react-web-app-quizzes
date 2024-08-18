
import { Route, Routes, Navigate } from "react-router";
import TOC from "./TOC";

import store from "./store";
import { Provider } from "react-redux";
export default function Labs() {
  return (
    <Provider store={store}>

      <div>
        <h1>Final Project</h1>
        <hr />

        <span>
          <p>Add Quizzes to Kanbas</p>
          <p>CS5610.61065.202460</p>
          <p>WebDev Team 9</p>

          <p id="wd-name">Yu Ge</p>
        </span>

        <TOC />
        <Routes>
          <Route path="/" element={<Navigate to="Lab1" />} />
        </Routes>
      </div>
    </Provider>
  );
}



