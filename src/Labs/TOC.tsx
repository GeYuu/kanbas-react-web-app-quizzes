import { useLocation } from "react-router";
export default function TOC() {
  const { pathname } = useLocation();
  return (
    <ul className="nav nav-pills">

      <li className="nav-item">
        <a id="wd-k" href="#/Kanbas" className="nav-link">
          Kanbas
        </a>
      </li>
      <li className="nav-item">
        <a id="wd-k" href="https://github.com/GeYuu/kanbas-react-web-app-quizzes" className="nav-link">
          GitHub Link - React Web App with Quizzes
        </a>
      </li>

      <li className="nav-item">
        <a id="wd-k" href="https://github.com/GeYuu/kanbas-node-server-app-quizzes" className="nav-link">
          GitHub Link - Node Server App with Quizzes

        </a>
      </li>

      <li className="nav-item">
        <a id="wd-k" href="https://kanbas-node-server-app-1-s6q2.onrender.com" className="nav-link">
          Render
        </a>
      </li>
    </ul>
  );
}
