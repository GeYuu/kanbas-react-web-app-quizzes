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

export default function PreviewResult() {
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

    const isOneQuestionAtATime = quiz.oneQuestionAtATime;

    const renderQuestion = (answer: any, index: number) => {
        const question = quiz.questions.find((q: any) => q.id === answer.questionId);
        return (
            <div key={index} className="card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <span className="fw-bold">Question {index + 1}</span>
                        <p className="mb-0">{question.title}</p>
                    </div>
                    <div className="d-flex align-items-center">
                        {(() => {
                            let isCorrect = false;
                            switch (question.type) {
                                case 'multiple-choice':
                                    isCorrect = question.choices.find((c: any) => c.text === answer.answer)?.isCorrect || false;
                                    break;
                                case 'true-false':
                                    isCorrect = (answer.answer === 'true') === question.isTrue;
                                    break;
                                case 'fill-in-blank':
                                    isCorrect = question.correctAnswers.some((ca: any) => ca.text.toLowerCase() === answer.answer.toLowerCase());
                                    break;
                            }
                            return isCorrect ? (
                                <span className="text-success me-2">
                                    <FaCheckCircle /> Correct
                                </span>
                            ) : (
                                <span className="text-danger me-2">
                                    <FaTimes /> Incorrect
                                </span>
                            );
                        })()}
                        <p className="mb-0">{answer.points} / {question.points} points</p>
                    </div>
                </div>
                <div className="card-body">
                    <p>{question.questionText}</p>

                    {question.type === 'multiple-choice' && (
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
                    )}

                    {question.type === 'true-false' && (
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
                    )}

                    {question.type === 'fill-in-blank' && (
                        <div>
                            <div className="mb-2">
                                <strong>Your answer:</strong>
                                <div>{answer.answer}</div>
                            </div>
                            <div>
                                <strong>Correct Answers:</strong>
                                {question.correctAnswers.map((correctAnswer: any, correctIndex: number) => (
                                    <div key={correctIndex} className="d-flex justify-content-between align-items-center">
                                        <span className="me-2">
                                            {correctAnswer.text}</span>

                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < result.answers.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">

                    
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <h2 className="mb-3">{quiz.title}</h2>
                            <p className="mb-1">Quiz Preview Result</p>
                        </div>
                        
                        <div>
                            <p className="mb-1"><strong>Total questions:</strong> {result.answers.length}</p>
                            <p className="mb-1"><strong>Score:</strong> {result.score.toFixed(2)}%</p>
                            <p className="mb-1"><strong>Points:</strong> {result.earnedPoints} / {result.totalPoints}</p>
                        </div>
                    </div>
                    <hr className="mb-2" />
                    <h5>Your Answers:</h5>
                    {isOneQuestionAtATime ? (
                        <>
                            {renderQuestion(result.answers[currentQuestionIndex], currentQuestionIndex)}
                            <div className="d-flex justify-content-between mt-3">
                                <button 
                                    className="btn btn-secondary" 
                                    onClick={handlePreviousQuestion}
                                    disabled={currentQuestionIndex === 0}
                                >
                                    Previous
                                </button>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={handleNextQuestion}
                                    disabled={currentQuestionIndex === result.answers.length - 1}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    ) : (
                        result.answers.map((answer: any, index: number) => renderQuestion(answer, index))
                    )}

                    <div className="d-flex justify-content-center">
                        <button
                            className="btn btn-secondary me-3"
                            onClick={() => navigate(`/kanbas/courses/${cid}/quizzes`)}
                        >
                            Back to Quizzes
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate(`/kanbas/courses/${cid}/quizzes/edit/${qid}`)}
                        >
                            Edit Quiz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}