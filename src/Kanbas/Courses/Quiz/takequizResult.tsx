import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

interface User {
    _id: string;
    username: string;
    role: string;
}

export default function TakeQuizResult() {
    const { qid, cid } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const result = location.state?.result;
    const currentUser = useSelector((state: RootState) => state.accountReducer.currentUser) as User | null;
    const quiz = useSelector((state: any) => state.quizzes.quizzes.find((q: any) => q._id === qid));

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    if (!result || !quiz) {
        return <div>No result data available</div>;
    }

    const renderQuestion = (answer: any, index: number) => {
        const question = quiz.questions[index];
        const isCorrect = answer.points === question.points; // Calculate correctness based on points
        return (
            <div key={index} className="card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <span className="fw-bold">Question {index + 1}</span>
                        <p className="mb-0">{question.title}</p>
                    </div>
                    <div className="d-flex align-items-center">
                        {isCorrect ? (
                            <span className="text-success me-2">
                                <FaCheckCircle /> Correct
                            </span>
                        ) : (
                            <span className="text-danger me-2">
                                <FaTimes /> Incorrect
                            </span>
                        )}
                        <p className="mb-0">{answer.points} / {question.points} points</p>
                    </div>
                </div>
                <div className="card-body">
                    <p>{question.questionText}</p>
                    {renderAnswerDetails(question, answer)}
                </div>
            </div>
        );
    };

    const renderAnswerDetails = (question: any, answer: any) => {
        switch (question.type) {
            case 'multiple-choice':
                return renderMultipleChoiceAnswer(question, answer);
            case 'true-false':
                return renderTrueFalseAnswer(question, answer);
            case 'fill-in-blank':
                return renderFillInBlankAnswer(question, answer);
            default:
                return null;
        }
    };

    const renderMultipleChoiceAnswer = (question: any, answer: any) => {
        return (
            <div>
                {question.choices.map((choice: any, choiceIndex: number) => (
                    <div key={choiceIndex} className="mb-2 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <div className="me-2" style={{ pointerEvents: 'none' }}>
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    checked={choice.text === answer.answer}
                                    readOnly
                                />
                            </div>
                            <span className={choice.text === answer.answer ? 'text-primary' : ''}>{choice.text}</span>
                        </div>
                        {choice.isCorrect && <span className="text-success">Correct Answer</span>}
                    </div>
                ))}
            </div>
        );
    };

    const renderTrueFalseAnswer = (question: any, answer: any) => {
        return (
            <div>
                <div className="mb-2 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <div className="me-2" style={{ pointerEvents: 'none' }}>
                            <input
                                type="radio"
                                className="form-check-input"
                                checked={answer.answer === 'true'}
                                readOnly
                            />
                        </div>
                        <span>True</span>
                    </div>
                    {question.isTrue && <span className="text-success">Correct Answer</span>}
                </div>
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <div className="me-2" style={{ pointerEvents: 'none' }}>
                            <input
                                type="radio"
                                className="form-check-input"
                                checked={answer.answer === 'false'}
                                readOnly
                            />
                        </div>
                        <span>False</span>
                    </div>
                    {!question.isTrue && <span className="text-success">Correct Answer</span>}
                </div>
            </div>
        );
    };

    const renderFillInBlankAnswer = (question: any, answer: any) => {
        return (
            <div>
                <div className="mb-2">
                    <strong>Your answer:</strong>
                    <div>{answer.answer}</div>
                </div>
                <div>
                    <strong>Correct Answers:</strong>
                    {question.correctAnswers.map((correctAnswer: any, correctIndex: number) => (
                        <div key={correctIndex} className="d-flex justify-content-between align-items-center">
                            <span className="me-2">{correctAnswer.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <h2 className="mb-3">{quiz.title}</h2>
                            <p className="mb-1">Quiz Result</p>
                        </div>
                        <div>
                            <div>
                                <p className="mb-1"><strong>Total questions:</strong> {result.answers.length}</p>
                                <p className="mb-1"><strong>Score:</strong> {result.scorePercentage.toFixed(2)}%</p>
                                <p className="mb-1"><strong>Points:</strong> {result.answers.reduce((sum: number, answer: { points: number }) => sum + answer.points, 0)} / {quiz.questions.reduce((sum: number, question: { points: number }) => sum + question.points, 0)}</p>
                            </div>
                        </div>
                    </div>
                    <hr className="mb-2" />
                    <h5>Your Answers:</h5>
                    {result.answers.map((answer: any, index: number) => renderQuestion(answer, index))}

                    <div className="d-flex justify-content-center mt-4">
                        <button
                            className="btn btn-secondary me-2"
                            onClick={() => navigate(`/kanbas/courses/${cid}/quizzes`)}
                        >
                            Back to Quiz List
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}