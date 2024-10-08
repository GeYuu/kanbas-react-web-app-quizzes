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

interface Answer {
    questionId: string;
    question: string;
    answer: string | boolean;
    correct: string | boolean | { text: string }[];
    points: number;
}

export default function Preview() {
    const { cid, qid } = useParams<{ cid: string, qid: string }>();
    const currentUser = useSelector((state: RootState) => state.accountReducer.currentUser) as User | null;
    const quiz = useSelector((state: any) => state.quizzes.quizzes.find((q: any) => q._id === qid));
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [selectedAnswers, setSelectedAnswers] = useState<any>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [unansweredQuestions, setUnansweredQuestions] = useState<number[]>([]);

    const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = event.target;
        setSelectedAnswers((prev: Record<string, string | boolean>) => ({
            ...prev,
            [name]: type === 'radio' ? value : type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = () => {
        const unanswered = quiz.questions.reduce((acc: number[], question: any, index: number) => {
            if (!selectedAnswers[`question-${question.id}`]) {
                acc.push(index + 1);
            }
            return acc;
        }, []);

        if (unanswered.length > 0) {
            setUnansweredQuestions(unanswered);
            return;
        }

        // Calculate results
        let totalPoints = 0;
        let earnedPoints = 0;
        let answers: Answer[] = [];

        quiz.questions.forEach((question: any) => {
            const selectedAnswer = selectedAnswers[`question-${question.id}`];

            if (selectedAnswer) {
                totalPoints += question.points;
                let isCorrect = false;

                if (question.type === "multiple-choice") {
                    const correctChoice = question.choices.find((choice: any) => choice.isCorrect);
                    isCorrect = correctChoice && selectedAnswer === correctChoice.text;
                } else if (question.type === "true-false") {
                    isCorrect = selectedAnswer.toLowerCase() === String(question.isTrue).toLowerCase();
                } else if (question.type === "fill-in-blank") {
                    isCorrect = question.correctAnswers.some((correctAnswer: any) => 
                        correctAnswer.text.toLowerCase() === selectedAnswer.toLowerCase()
                    );
                }

                const earnedPointsForQuestion = isCorrect ? question.points : 0;
                earnedPoints += earnedPointsForQuestion;

                answers.push({
                    questionId: question.id,
                    question: question.title,
                    answer: selectedAnswer,
                    correct: isCorrect,
                    points: earnedPointsForQuestion
                });
            }
        });

        const score = (earnedPoints / totalPoints) * 100;
        const result = {
            answers: answers,
            score: score,
            totalPoints: totalPoints,
            earnedPoints: earnedPoints
        }

        navigate(`/kanbas/courses/${cid}/quizzes/${qid}/preview/result`, { state: { result } });
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    if (!quiz) {
        return <div>Quiz not found</div>;
    }

    const renderQuestion = (question: any, index: number) => (
        <div key={question.id} className="row justify-content-center mb-4">
            <div className="col-6">
                <div className="card">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <div>
                            <span className="fw-bold">Question {index + 1}</span>
                            <p className="mb-0">{question.title}</p>
                        </div>
                        <p className="mb-0">{question.points} points</p>
                    </div>

                    <div className="card-body">
                        <p>{question.questionText}</p>
                        {question.type === "multiple-choice" && (
                            <div>
                                {question.choices?.map((option: any) => (
                                    <div key={option._id} className="form-check mb-2">
                                        <input
                                            type="radio"
                                            name={`question-${question.id}`}
                                            value={option.text}
                                            className="form-check-input"
                                            onChange={handleAnswerChange}
                                        />
                                        <label className="form-check-label">{option.text}</label>
                                    </div>
                                ))}
                            </div>
                        )}

                        {question.type === "true-false" && (
                            <div>
                                <div className="form-check mb-2">
                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        value="true"
                                        className="form-check-input"
                                        onChange={handleAnswerChange}
                                    />
                                    <label className="form-check-label">True</label>
                                </div>
                                <div className="form-check mb-2">
                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        value="false"
                                        className="form-check-input"
                                        onChange={handleAnswerChange}
                                    />
                                    <label className="form-check-label">False</label>
                                </div>
                            </div>
                        )}
                        {question.type === "fill-in-blank" && (
                            <div>
                                <input
                                    type="text"
                                    className="form-control"
                                    name={`question-${question.id}`}
                                    onChange={handleAnswerChange}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container ">
            <h1>{quiz.title}</h1>

            <div className="alert alert-danger" role="alert">
                <FaExclamationCircle className="me-2" />
                <strong>Preview Mode:</strong> This is a preview of the published version of the quiz. Students will see this view when taking the quiz.
            </div>

            <h2>Quiz Instructions</h2>
            <p>{quiz.description}</p>

            {unansweredQuestions.length > 0 && (
                <div className="alert alert-warning" role="alert">
                    <FaExclamationCircle className="me-2" />
                    Please answer all questions before submitting. Unanswered questions: {unansweredQuestions.join(', ')}
                </div>
            )}

            <hr className="mb-4" />

            <div className="quiz-questions">
                {quiz.questions && Array.isArray(quiz.questions) ? (
                    quiz.oneQuestionAtATime ? (
                        <>
                            {renderQuestion(quiz.questions[currentQuestionIndex], currentQuestionIndex)}
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
                                    disabled={currentQuestionIndex === quiz.questions.length - 1}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    ) : (
                        quiz.questions.map((question: any, index: number) => renderQuestion(question, index))
                    )
                ) : (
                    <div>No questions found for this quiz</div>
                )}
            </div>

            <div className="d-flex justify-content-center mt-4">
                <button className="btn btn-primary me-2" onClick={() => navigate(`/kanbas/courses/${cid}/quizzes/edit/${qid}`)}>Edit Quiz</button>
                <button className="btn btn-primary me-2" onClick={handleSubmit}>Submit Quiz</button>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
            </div>
        </div>
    );
}