import { BsGripVertical } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { IoEllipsisVertical } from "react-icons/io5";
import { PiRocketLaunchBold } from "react-icons/pi";
import { VscTriangleDown } from "react-icons/vsc";
import { useParams, useNavigate, Link } from "react-router-dom";
import GreenCheckmark from "./GreenCheckmark";
import * as client from "./client";
import { useEffect, useState } from "react";
import { setQuizzes } from "./reducer";
import { useDispatch, useSelector } from "react-redux";
import { deleteQuiz } from "./reducer";
import { format } from 'date-fns';
import { RootState } from "../../store";
import { MdDoNotDisturbAlt } from "react-icons/md";
import QuizContextMenu from "./QuizContextMenu";
import { useCallback } from "react";

import './styles.css';

interface User {
    _id: string;
    username: string;
    role: string;
}

interface Quiz {
    _id: string;
    title: string;
    published: boolean;
    availableFrom: string;
    availableUntil: string;
    dueDate: string;
    points: number;
    questions: any[];
    scores: Record<string, number>;
    course: string;
}

export default function Quizzes() {
    const { cid } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    
    const [contextMenuQuizId, setContextMenuQuizId] = useState<string | null>(null); // Manage context menu state
    const quizzes = useSelector((state: any) => state.quizzes.quizzes.filter((a: any) => a.course === cid));
    const currentUser = useSelector((state: RootState) => state.accountReducer.currentUser) as User | null;
    const [lastAttemptScores, setLastAttemptScores] = useState<Record<string, number>>({});


    

    const fetchQuizzes = useCallback(async () => {
        const fetchedQuizzes = await client.findQuizzesForCourse(cid as string);
        dispatch(setQuizzes(fetchedQuizzes));
    }, [cid, dispatch]);

    const getLastAttemptScores = useCallback(async () => {
        if (quizzes.length > 0 && currentUser?._id) {
            const scores = await Promise.all(quizzes.map(async (quiz: Quiz) => {
                const result = await client.findLastAttemptScore(quiz._id, currentUser._id);
                return { quizId: quiz._id, score: result.score };
            }));
            setLastAttemptScores(Object.fromEntries(scores.map(({ quizId, score }) => [quizId, score])));
        }
    }, [quizzes, currentUser]);

    useEffect(() => {
        fetchQuizzes();
    }, [fetchQuizzes]);

    useEffect(() => {
        getLastAttemptScores();
    }, [getLastAttemptScores]);

    const handleCreateQuiz = () => {
        navigate(`/Kanbas/Courses/${cid}/quizzes/new`);
    }

    const handleDeleteQuiz = (id: string) => {
        if (window.confirm("Are you sure you want to delete this quiz?")) {
            removeQuiz(id);
        }
    }

    const handlePublishQuiz = async (quizId: string) => {
        await client.publishQuiz(cid as string, quizId);
        fetchQuizzes();
    }

    const handleEditQuiz = (quizId: string) => {
        navigate(`/Kanbas/Courses/${cid}/quizzes/edit/${quizId}`);
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
            return <span className="text-danger">Closed</span>;
            
        } else if (currentDate >= availableFromDate && currentDate <= availableUntilDate) {
            return <span className="text-success">Available</span>;
        } else if (currentDate < availableFromDate) {
            return <span className="text-danger">Not available until {format(availableFromDate, 'MMM d \'at\' h:mmaaa')}</span>;
        }
    };




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
                        {currentUser?.role === 'FACULTY' && (
                            <div className="input-group-append ">
                                <button className="btn btn-danger"
                                    onClick={handleCreateQuiz}>
                                    + Quiz</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <hr />
            <ul id="wd-modules" className="list-group rounded-0 border border-left-success">
                <li className="list-group-item p-0 fs-5 border-gray">
                    <div className="wd-title p-3 ps-2">
                        <VscTriangleDown className="me-2 fs-3" />
                        Quizzes
                     
                    </div>
                    <ul className="wd-lessons list-group rounded-0">
                        {quizzes.filter((quiz: Quiz) => currentUser?.role === 'FACULTY' || quiz.published).map((quiz: Quiz) => (
                            <li key={quiz._id} className="wd-lesson list-group-item p-3 ps-1">
                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center">
                                        <PiRocketLaunchBold className="ms-4 me-2 fs-3 text-success" />
                                    </div>
                                    <div className="w-75">
                                        <Link className="text-decoration-none text-dark" to={`/Kanbas/Courses/${cid}/quizzes/details/${quiz._id}`}>
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
                                            <span>{quiz.points} pts</span>
                                            <span> | </span>
                                            {/* Number of questions */}
                                            <span>{quiz.questions.length} questions</span>
                                            {/* Score (only for students) */}
                                            {currentUser?.role === 'STUDENT' && lastAttemptScores[quiz._id] !== undefined && lastAttemptScores[quiz._id] !== null  && lastAttemptScores[quiz._id] !== -1 && (
                                                <>
                                                <span className="text-dark"
                                                > | Last Attempt Score:</span>
                                                
                                                <span> {lastAttemptScores[quiz._id]} pts</span>
                                                </>
                                            )}
                                            
                                        </span>
                                    </div>
                                    <div className="float-end position-relative">
                                        {/* publish */}
                                        {currentUser?.role !== 'STUDENT' && (
                                            <button 
                                                className="btn btn-link text-dark fs-4"
                                                onClick={() => handlePublishQuiz(quiz._id)}
                                            >
                                                {quiz.published ? <GreenCheckmark /> : <MdDoNotDisturbAlt />}
                                            </button>
                                        )}
                                        {currentUser?.role !== 'STUDENT' && (
                                            <IoEllipsisVertical className="fs-4" onClick={() => setContextMenuQuizId(quiz._id)} />
                                        )}
                                        {contextMenuQuizId === quiz._id && (
                                            <QuizContextMenu
                                                quizId={quiz._id}
                                                onClose={() => setContextMenuQuizId(null)}
                                                onEdit={() => handleEditQuiz(quiz._id)}
                                                onPublish={() => handlePublishQuiz(quiz._id)}
                                                onDelete={() => handleDeleteQuiz(quiz._id)}
                                                isPublished={quiz.published}
                                            />
                                        )}
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