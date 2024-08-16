import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { FaExclamationCircle } from "react-icons/fa";


interface User {
    _id: string;
    username: string;
    role: string;
}

export default function Preview() {
    const { qid } = useParams();
    const currentUser = useSelector((state: RootState) => state.accountReducer.currentUser) as User | null;
    const quiz = useSelector((state: any) => state.quizzes.quizzes.find((q: any) => q._id === qid));
    const navigate = useNavigate();

    console.log("Quiz:", quiz);
    console.log("QID:", qid);
    console.log("Full quiz object:", JSON.stringify(quiz, null, 2));

    if (!quiz) {
        return <div>Quiz not found</div>;
    }

    return (
        <div className="container ">
            <h1>{quiz.title}</h1>

            <div className="alert alert-danger" role="alert">
                <FaExclamationCircle />
                <strong>Preview Mode:</strong> This is a preview of the published version of the quiz. Students will see this view when taking the quiz.
            </div>

            <h2>Quiz Instructions</h2>
            <p>{quiz.description}</p>

            <hr />

            <div className="quiz-questions">
                {quiz.questions && Array.isArray(quiz.questions) ? (
                    quiz.questions.map((question: any) => (
                        <div key={question.id} className="row justify-content-center mb-4">
                            <div className="col-6">
                                <div className="card">
                                    <div className="card-header">
                                        <h3>{question.title}</h3>
                                        <p>{question.points} points</p>
                                    </div>

                                    <div className="card-body">
                                        <p>{question.questionText}</p>
                                        {question.type === "multiple-choice" && (
                                            <div>
                                                {question.choices?.map((option: any) => (
                                                    <div key={option._id} className="form-check mb-2">
                                                        <input type="radio" className="form-check-input" />
                                                        <label className="form-check-label">{option.text}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {question.type === "true-false" && (
                                            <div >
                                                <div>
                                                    <input type="radio" className="form-check-input mb-2" />
                                                    <label className="form-check-label">True</label>
                                                </div>
                                                <div>

                                                </div>
                                                <input type="radio" className="form-check-input mb-2" />
                                                <label className="form-check-label">False</label>

                                            </div>
                                        )}
                                        {question.type === "fill-in-blank" && (
                                            <div>
                                                <input type="text" className="form-control" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No questions found for this quiz</div>
                )}
            </div>
        </div>
    );
}