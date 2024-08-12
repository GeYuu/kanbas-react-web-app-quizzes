import "./index.css";
import { Link, useLocation } from "react-router-dom";

export default function CoursesNavigation() {
    const { pathname } = useLocation();
    const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];

    return (
        <div id="wd-courses-navigation" className="list-group fs-5 rounded-0">
            {links.map((link) => {
                const isActive = pathname.toLowerCase().includes(link.toLowerCase());
                return (
                    <Link
                        key={link}
                        to={link.toLowerCase()}
                        className={`list-group-item border-0 ${isActive ? "active text-dark bg-white" : "text-danger"}`}
                    >
                        {link}
                    </Link>
                );
            })}
        </div>
    );
}
