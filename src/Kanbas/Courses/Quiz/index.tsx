import { BsGripVertical } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { PiRocketLaunchBold } from "react-icons/pi";
import { VscTriangleDown } from "react-icons/vsc";
import { useParams, useNavigate, Link } from "react-router-dom";
import GreenCheckmark from "./GreenCheckmark";
import ModuleControlButtons from "./ModuleControlButtons";
import * as client from "./client";
import { useEffect } from "react";
import { setQuizzes } from "./reducer";
import { useDispatch, useSelector } from "react-redux";
import { deleteQuiz } from "./reducer";
import { format } from 'date-fns';
import { RootState } from "../../store";

interface User {
    _id: string;
    username: string;
    role: string;
}

export default function Quizzes() {
    const { cid } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const quizzes = useSelector((state: any) => state.quizzes.quizzes.filter((a: any) => a.course === cid));
    const currentUser = useSelector((state: RootState) => state.accountReducer.currentUser) as User | null;
    const fetchQuizzes = async () => {
        const quizzes = await client.findQuizzesForCourse(cid as string);
        dispatch(setQuizzes(quizzes));
    }

    const handleCreateQuiz = () => {
        navigate(`/Kanbas/Courses/${cid}/quizzes/new`);
    }

    const handleDeleteQuiz = (id: string) => {
        if (window.confirm("Are you sure you want to delete this quiz?")) {
            removeQuiz(id);
        }
    }

    const removeQuiz = async (quizId: string) => {
        await client.deleteQuiz(cid as string, quizId);
        dispatch(deleteQuiz(quizId));
    }

    const formatDate = (date: string) => {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return date;
        }
        return format(parsedDate, 'MMM d \'at\' h:mmaaa');
    };

    const getAvailabilityStatus = (availableFrom: string, availableUntil: string) => {
        const currentDate = new Date();
        const availableFromDate = new Date(availableFrom);
        const availableUntilDate = new Date(availableUntil);

        if (isNaN(availableFromDate.getTime())) {
            return 'Invalid Available From Date';
        }

        if (isNaN(availableUntilDate.getTime())) {
            return 'Invalid Available Until Date';
        }

        if (currentDate > availableUntilDate) {
            return 'Closed';
        } else if (currentDate >= availableFromDate && currentDate <= availableUntilDate) {
            return 'Available';
        } else if (currentDate < availableFromDate) {
            return `Not available until ${format(availableFromDate, 'MMM d \'at\' h:mmaaa')}`;
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, [cid]);

    return (
        <div>
            <div className="container mt-5 mb-2">
                <div className="row">
                    <div className="col-6">
                        <input type="text"
                            className="form-control"
                            placeholder="Search for quizzes" />
                    </div>
                    <div className="col-6 d-flex justify-content-end">
                        <div className="input-group-append me-3">
                            <button className="btn btn-danger"
                                onClick={handleCreateQuiz}>
                                + Quiz</button>
                        </div>
                        <button className="btn btn-secondary">
                            <BsGripVertical />
                        </button>
                    </div>
                </div>
            </div>
            <hr />
            <ul id="wd-modules" className="list-group rounded-0 border border-left-success">
                <li className="list-group-item p-0 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2">
                        <VscTriangleDown className="me-2 fs-3" />
                        Quizzes
                        <ModuleControlButtons />
                    </div>
                    <ul className="wd-lessons list-group rounded-0">
                        {quizzes.map((quiz: any) => (
                            <li key={quiz._id} className="wd-lesson list-group-item p-3 ps-1">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <PiRocketLaunchBold className="ms-4 me-2 fs-3 text-success" />
                                    </div>
                                    <div className="w-75">
                                        <Link className="text-decoration-none text-dark" to={`/Kanbas/Courses/${cid}/quizzes/${quiz._id}`}>
                                            <div className="d-flex justify-content-between"><b>{quiz.title}</b></div>
                                        </Link>
                                        <span className="text-secondary">
                                            {/* Availability */}
                                            <span className="text-dark"
                                            >{getAvailabilityStatus(quiz.availableFrom, quiz.availableUntil)}</span>
                                            <span> | </span>
                                            {/* Due Date */}
                                            <span className="text-dark"
                                            >Due: </span>
                                            <span>{formatDate(quiz.dueDate)}</span>
                                            <span> | </span>
                                            {/* Points */}
                                            <span>{quiz.points} points</span>
                                            <span> | </span>
                                            {/* Number of questions */}
                                            <span>{quiz.questions.length} questions</span>
                                            {/* Score */}
                                            {/* only if current user is student, show */}
                                            <span>
                                                {currentUser?.role === 'student' && quiz.scores && quiz.scores[currentUser._id] &&
                                                    <span> |  {quiz.scores[currentUser._id].score} / {quiz.points}</span>}

                                            </span>
                                        </span>
                                    </div>
                                    <div className="float-end">
                                        <FaTrash
                                            className="text-danger me-2 mb-1"
                                            onClick={() => handleDeleteQuiz(quiz._id)}
                                        />
                                        <GreenCheckmark />
                                        <IoEllipsisVertical className="fs-4"
                                            onClick={() => handleDeleteQuiz(quiz._id)}
                                        />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </li>
            </ul>
        </div>
    );
}
