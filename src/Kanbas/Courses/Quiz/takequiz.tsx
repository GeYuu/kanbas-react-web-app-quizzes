import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { FaExclamationCircle } from "react-icons/fa";
import { submitQuiz } from "./client";

interface User {
    _id: string;
    username: string;
    role: string;
}

interface Answer {
    questionID: string;
    questionTitle: string;
    questionType: string;
    questionOptions: any[];
    selectedAnswer: string | boolean;
    correctAnswer: string;
    isCorrect: boolean;
    points: number;
    questionPoints: number;
    correct: boolean;
    answer: string | boolean;
}

export default function TakeQuiz() {
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

    const handleSubmit = async () => {
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

            if (selectedAnswer !== undefined) {
                totalPoints += question.points;
                let isCorrect = false;
                let correctAnswer = '';

                if (question.type === "multiple-choice") {
                    const correctChoice = question.choices.find((choice: any) => choice.isCorrect);
                    isCorrect = correctChoice && selectedAnswer === correctChoice.text;
                    correctAnswer = correctChoice ? correctChoice.text : '';
                } else if (question.type === "true-false") {
                    isCorrect = selectedAnswer.toLowerCase() === String(question.isTrue).toLowerCase();
                    correctAnswer = String(question.isTrue);
                } else if (question.type === "fill-in-blank") {
                    isCorrect = question.correctAnswers.some((correctAns: any) =>
                        correctAns.text.toLowerCase() === selectedAnswer.toLowerCase()
                    );
                    correctAnswer = question.correctAnswers[0].text;
                }

                const earnedPointsForQuestion = isCorrect ? question.points : 0;
                earnedPoints += earnedPointsForQuestion;

                answers.push({
                    questionID: question.id,
                    questionTitle: question.title,
                    questionType: question.type,
                    questionOptions: question.choices || [],
                    selectedAnswer: selectedAnswer,
                    correctAnswer: correctAnswer,
                    isCorrect: isCorrect,
                    points: earnedPointsForQuestion,
                    questionPoints: question.points,
                    correct: isCorrect,
                    answer: selectedAnswer
                });
            }
        });

        const score = (earnedPoints / totalPoints) * 100;

        const quizTakenData = {
            studentID: currentUser?._id,
            quizID: qid,
            scorePercentage: score,

            pointsEarned: earnedPoints,
            totalPoints: totalPoints,

            answers: answers
        };

        try {
            const result = await submitQuiz(quizTakenData, qid as string);
            console.log('Quiz submitted successfully:', result);
            // Navigate to result page
            navigate(`/kanbas/courses/${cid}/quizzes/${qid}/takequiz/result`, { state: { result } });
        } catch (error) {
            console.error('Error submitting quiz:', error);
            // Show error message to user
            alert('Failed to submit quiz. Please try again.');
        }
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
                <button className="btn btn-primary" onClick={handleSubmit}>Submit Quiz</button>
            </div>
        </div>
    );
}