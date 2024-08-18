import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from "react";
import { addQuiz, updateQuiz } from "./reducer";
import * as client from "./client";
import { BsGripVertical } from "react-icons/bs";
import { MdDoNotDisturbAlt } from "react-icons/md";
import GreenCheckmark from "./GreenCheckmark";
import './styles.css';
import Editor from 'react-simple-wysiwyg';
import { format } from 'date-fns';
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import TrueFalseQuestion from "./TrueFalseQuestion";
import FillInBlankQuestion from "./FillInBlankQuestion";

type Quiz = {
    quizType: string;
    assignmentgroup: string;
    shuffleAnswers: boolean;
    timeLimit: boolean;
    timeLimitEntry: number;
    attemptLimit: number;
    allowMultipleAttempts: boolean;
    showCorrectedAnswers: boolean;
    accessCode: boolean;
    accessCodeEntry: number;
    oneQuestionAtATime: boolean;
    webCamRequired: boolean;
    lockQuestionsAfterAnswering: boolean;
    _id: string;
    title: string;
    course: string;
    questions: any[];
    description?: string;
    points?: number;
    dueDate?: string;
    availableFrom?: string;
    availableUntil?: string;
    published: boolean;


};

export default function QuizEditor() {
    const { cid, qid } = useParams<{ cid: string, qid: string }>();

    console.log(cid, qid);
    const quizzes = useSelector(
        (state: { quizzes: { quizzes: Quiz[] } }) => state.quizzes.quizzes);
    const [html, setHtml] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedQuestionType, setSelectedQuestionType] = useState<string>('');

    const createQuiz = async (quiz: any) => {
        const newQuiz = await client.createQuiz(cid as string, { ...quiz, course: cid });
        dispatch(addQuiz(newQuiz));
    }

    const saveQuiz = async (quiz: any) => {
        const updatedQuiz = await client.updateQuiz(cid as string, { ...quiz, course: cid });
        dispatch(updateQuiz(updatedQuiz));
    }

    const existingQuiz = quizzes.find(a => a._id === qid);

    console.log("existingQuiz", existingQuiz);

    const formatDateForInput = (dateString = '') => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return format(date, "yyyy-MM-dd'T'HH:mm");
    };

    const [quiz, setQuiz] = useState<Quiz>({
        quizType: existingQuiz?.quizType || 'Graded Quiz',
        assignmentgroup: existingQuiz?.assignmentgroup || 'Quizzes',
        shuffleAnswers: existingQuiz?.shuffleAnswers ?? true,
        timeLimit: existingQuiz?.timeLimit ?? true,
        timeLimitEntry: existingQuiz?.timeLimitEntry || 20,
        attemptLimit: existingQuiz?.attemptLimit || 1,
        allowMultipleAttempts: existingQuiz?.allowMultipleAttempts ?? false,
        showCorrectedAnswers: existingQuiz?.showCorrectedAnswers ?? false,
        accessCode: existingQuiz?.accessCode ?? false,
        accessCodeEntry: existingQuiz?.accessCodeEntry || 0,
        oneQuestionAtATime: existingQuiz?.oneQuestionAtATime ?? true,
        webCamRequired: existingQuiz?.webCamRequired ?? false,
        lockQuestionsAfterAnswering: existingQuiz?.lockQuestionsAfterAnswering ?? false,
        _id: existingQuiz?._id || new Date().getTime().toString(),
        title: existingQuiz?.title || "unnamed quiz",
        course: existingQuiz?.course || cid!,
        questions: existingQuiz?.questions || [],
        description: existingQuiz?.description || '',
        points: existingQuiz?.points || 0,
        dueDate: formatDateForInput(existingQuiz?.dueDate),
        availableFrom: formatDateForInput(existingQuiz?.availableFrom),
        availableUntil: formatDateForInput(existingQuiz?.availableUntil),
        published: existingQuiz?.published ?? false,
    });

    const [errors, setErrors] = useState({
        title: false,
        dueDate: false,
        availableFrom: false,
        availableUntil: false,
    });

    const handleCancel = () => {
        navigate(`/Kanbas/Courses/${cid}/quizzes`);
    };
    const handleSave = () => {
        const newErrors = {
            title: !quiz.title.trim(),
            dueDate: !quiz.dueDate,
            availableFrom: !quiz.availableFrom,
            availableUntil: !quiz.availableUntil,
        };

        setErrors(newErrors);

        // Validate questions
        const questionErrors = quiz.questions.map(question => {
            const baseErrors = {
                title: !question.title.trim(),
                points: question.points <= 0,
                questionText: !question.questionText.trim(),
            };

            switch (question.type) {
                case 'multiple-choice':
                    return {
                        ...baseErrors,
                        choices: question.choices.length === 0,
                        correctAnswer: !question.choices.some((choice: { isCorrect: boolean }) => choice.isCorrect),
                    };
                case 'true-false':
                    return baseErrors;
                case 'fill-in-blank':
                    return {
                        ...baseErrors,
                        correctAnswers: question.correctAnswers.length === 0 || question.correctAnswers.some((answer: { text: string }) => !answer.text.trim()),
                    };
                default:
                    return baseErrors;
            }
        });

        const hasQuestionErrors = questionErrors.some(errors => Object.values(errors).some(error => error));

        if (Object.values(newErrors).some(error => error) || hasQuestionErrors) {
            // If there are any errors, don't save
            alert("Please correct all errors before saving.");
            return;
        }

        const totalPoints = quiz.questions.reduce((sum, question) => sum + (question.points || 0), 0);
        const updatedQuiz = { ...quiz, points: totalPoints };

        if (qid && existingQuiz) {
            saveQuiz(updatedQuiz);
        } else {
            createQuiz(updatedQuiz);
        }
        navigate(`/Kanbas/Courses/${cid}/quizzes`);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setQuiz(prevQuiz => ({
            ...prevQuiz,
            [id]: type === 'checkbox' ? checked : value
        }));
    };


    const addNewQuestion = (type: string) => {
        const newQuestion = {
            id: new Date().getTime().toString(),
            type,
            title: '',
            points: 0,
            questionText: '',
            choices: type === 'multiple-choice' ? [{ text: '', isCorrect: false }] : [],
            isTrue: type === 'true-false' ? true : false,
            correctAnswers: type === 'fill-in-blank' ? [{ id: new Date().getTime().toString(), text: '' }] : [],
        };
        setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
    };

    const updateQuestion = (index: number, updatedQuestion: any) => {
        const updatedQuestions = quiz.questions.map((q, i) =>
            i === index ? updatedQuestion : q
        );
        setQuiz({ ...quiz, questions: updatedQuestions });
    };

    const deleteQuestion = (questionId: string) => {
        setQuiz({ ...quiz, questions: quiz.questions.filter(q => q.id !== questionId) });
    };






    return (
        <div id="wd-quiz-editor">


            <div className="row justify-content-end align-items-center mb-4">
                <div className="col-auto">
                    <span className="fw-bold me-2">Points</span>
                    {quiz.points}
                </div>
                <div className="col-auto">
                    <span className="text-muted">

                        {/* if the quiz is published, show a green checkmark
                        if the quiz is not published, show a gray MdDoNotDisturbAlt
                         */}





                        {quiz.published === true ? (
                            <span className="text-success me-2">
                                <GreenCheckmark />
                                Published</span>



                        ) : (
                            <span className="text-secondary me-2">
                                <MdDoNotDisturbAlt />
                                Not Published</span>
                        )}

                    </span>



                </div>
            </div>

            <hr />

            {/* two tabs */}
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <a className="nav-link active"
                        href="#details" data-bs-toggle="tab">Details</a>
                </li>
                <li className="nav-item ms-2">
                    <a className="nav-link" href="#questions" data-bs-toggle="tab">Questions</a>
                </li>
            </ul>
            <div className="tab-content mt-3">
                <div className="tab-pane fade show active" id="details">

                    <div className="row">


                        <div className="mb-3">

                            <label htmlFor="title" className="form-label fw-bold">
                                Quiz Title
                            </label>

                            <input
                                id="title"
                                value={quiz.title}
                                onChange={handleChange}
                                className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                placeholder="Unnamed Quiz"
                            />
                            {errors.title && <div className="invalid-feedback">Title is required</div>}
                        </div>

                        <div className="mb-3">

                            <label htmlFor="description" className="form-label">
                                Quiz Instructions
                            </label>
                            <Editor
                                value={quiz.description}
                                className="editor"
                                onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                            />

                        </div>

                        <hr />
                        <label htmlFor="options" className="form-label">
                            <b>Options</b>
                        </label>



                        <div className="container ">



                            <div className="row mb-3 align-items-left">
                                <div className="col-md-4 text-end">
                                    <label htmlFor="quizType" className="form-label">Quiz Type</label>
                                </div>
                                <div className="col-md-6">
                                    <select
                                        id="quizType"
                                        className="form-select"
                                        value={quiz.quizType}
                                        onChange={handleChange}
                                    >
                                        <option value="Graded Quiz">Graded Quiz</option>
                                        <option value="Practice Quiz">Practice Quiz</option>
                                        <option value="Ungraded Quiz">Ungraded Quiz</option>
                                        <option value="Graded Survey">Graded Survey</option>
                                        <option value="Ungraded Survey">Ungraded Survey</option>
                                    </select>
                                </div>
                            </div>


                            <div className="row mb-3 align-items-left">
                                <div className="col-md-4 text-end">
                                    <label htmlFor="assignmentgroup" className="form-label">Assignment Group</label>
                                </div>
                                <div className="col-md-6">
                                    <select id="assignmentgroup"
                                        className="form-select"
                                        value={quiz.assignmentgroup}
                                        onChange={handleChange}
                                    >
                                        <option selected>Quizzes</option>
                                        <option value="1">Quizzes</option>
                                        <option value="2">Exams</option>
                                        <option value="3">Assignments</option>
                                        <option value="4">Project</option>
                                    </select>
                                </div>
                            </div>


                            <div className="row mb-3 ">
                                <div className="col-md-4">
                                </div>
                                <div className="col-md-8">
                                    <input
                                        className="form-check-input me-2 col-md-6"
                                        type="checkbox"
                                        checked={quiz.shuffleAnswers === true}
                                        onChange={(e) => setQuiz({ ...quiz, shuffleAnswers: e.target.checked })}
                                        id="shuffleAnswers"
                                    />
                                    <label className="form-check-label mb-0 col-md-6"
                                        htmlFor="shuffleAnswers">
                                        Shuffle Answers
                                    </label>
                                </div>
                            </div>




                            <div className="row mb-3">
                                <div className="col-md-4">
                                </div>
                                <div className="col-md-8">
                                    <div className="d-flex align-items-center mb-2">
                                        <input
                                            className="form-check-input me-2"
                                            type="checkbox"
                                            checked={quiz.timeLimit === true}
                                            onChange={(e) => setQuiz({ ...quiz, timeLimit: e.target.checked })}
                                            id="timeLimit"
                                        />
                                        <label className="form-check-label me-4"
                                            htmlFor="timeLimit">
                                            Time Limit
                                        </label>
                                        <input
                                            id="timeLimitEntry"
                                            type="number"
                                            value={quiz.timeLimitEntry}
                                            onChange={handleChange}
                                            className="form-control me-2"
                                            defaultValue={20}
                                            style={{ width: '80px' }}
                                        />
                                        <label htmlFor="timeLimitEntry">
                                            Minutes
                                        </label>
                                    </div>
                                </div>
                            </div>





                            <div className="row mb-3 ">
                                <div className="col-md-4">
                                </div>
                                <div className="col-md-8">
                                    <div className="d-flex align-items-center mb-2">
                                    <input className="form-check-input me-2"
                                        type="checkbox"
                                        checked={quiz.allowMultipleAttempts === true}
                                        onChange={(e) => setQuiz({ ...quiz, allowMultipleAttempts: e.target.checked })}
                                        id="allowMultipleAttempts"
                                    />
                                    
                                        <label className="form-check-label me-4"
                                            htmlFor="allowMultipleAttempts">
                                            Allow Multiple Attempts
                                        </label>
                                        <input
                                            id="attemptLimit"
                                            type="number"
                                            value={quiz.attemptLimit}
                                            onChange={handleChange}
                                            className="form-control me-2"
                                            style={{ width: '80px' }}
                                        />
                                        <label htmlFor="attemptLimit">Attempt Limit</label>


                                    </div>
                                </div>
                            </div>

                            <div className="row mb-3 ">
                                <div className="col-md-4">
                                </div>
                                <div className="col-md-8">
                                    <input className="form-check-input me-2"
                                        type="checkbox"
                                        checked={quiz.showCorrectedAnswers === true}
                                        onChange={(e) => setQuiz({ ...quiz, showCorrectedAnswers: e.target.checked })}
                                        id="showCorrectedAnswers"
                                    />
                                    <label className="form-check-label" htmlFor="showCorrectedAnswers">
                                        Show Corrected Answers
                                    </label>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-4">
                                </div>
                                <div className="col-md-8">
                                    <div className="d-flex align-items-center mb-2">
                                        <input
                                            className="form-check-input me-2"
                                            type="checkbox"
                                            checked={quiz.accessCode === true}
                                            onChange={(e) => setQuiz({ ...quiz, accessCode: e.target.checked })}
                                            id="accessCode"
                                        />
                                        <label className="form-check-label me-5" htmlFor="accessCode">
                                            Access Code
                                        </label>
                                        <input
                                            type="number"
                                            id="accessCodeEntry"
                                            className="form-control me-2 w-50"
                                            value={quiz.accessCodeEntry}
                                            onChange={handleChange}
                                            placeholder="Enter Access Code"

                                        />

                                    </div>
                                </div>
                            </div>



                            <div className="row mb-3 ">
                                <div className="col-md-4">
                                </div>
                                <div className="col-md-8">
                                    <input className="form-check-input me-2"
                                        type="checkbox"
                                        checked={quiz.oneQuestionAtATime === true}
                                        onChange={(e) => setQuiz({ ...quiz, oneQuestionAtATime: e.target.checked })}
                                        id="oneQuestionAtATime"
                                        
                                    />
                                    <label className="form-check-label" htmlFor="oneQuestionAtATime">
                                        One Question at a Time
                                    </label>
                                </div>
                            </div>


                            <div className="row mb-3 ">
                                <div className="col-md-4">
                                </div>
                                <div className="col-md-8">
                                    <input className="form-check-input me-2"
                                        type="checkbox"
                                        checked={quiz.webCamRequired === true}
                                        onChange={(e) => setQuiz({ ...quiz, webCamRequired: e.target.checked })}
                                        id="webCamRequired"
                                    />
                                    <label className="form-check-label" htmlFor="webCamRequired">
                                        WebCam Required
                                    </label>
                                </div>
                            </div>


                            <div className="row mb-3 mb-4 ">
                                <div className="col-md-4">
                                </div>
                                <div className="col-md-8">
                                    <input className="form-check-input me-2"
                                        type="checkbox"
                                        checked={quiz.lockQuestionsAfterAnswering === true}
                                        onChange={(e) => setQuiz({ ...quiz, lockQuestionsAfterAnswering: e.target.checked })}
                                        id="lockQuestionsAfterAnswering"
                                    />
                                    <label className="form-check-label" htmlFor="lockQuestionsAfterAnswering">
                                        Lock Questions After Answering
                                    </label>
                                </div>
                            </div>



                            <div className="row ">

                                <div className="col-md-4 ">
                                    <label htmlFor="dueDate" className="form-label float-end">
                                        Due
                                    </label>
                                </div>
                                <div className="col-md-6 border border-gray rounded-3 p-2">
                                    <div className="mb-3">
                                        <label htmlFor="dueDate" className="form-label">
                                            Due Date
                                        </label>
                                        <input
                                            id="dueDate"
                                            type="datetime-local"
                                            value={quiz.dueDate}
                                            onChange={handleChange}
                                            className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`}
                                        />
                                        {errors.dueDate && <div className="invalid-feedback">Due date is required</div>}
                                    </div>
                                    <div className="row">
                                        <div className="col-6">
                                            <label htmlFor="availableFrom" className="form-label">
                                                Available From
                                            </label>
                                            <input
                                                id="availableFrom"
                                                type="datetime-local"
                                                value={quiz.availableFrom}
                                                onChange={handleChange}
                                                className={`form-control ${errors.availableFrom ? 'is-invalid' : ''}`}
                                            />
                                            {errors.availableFrom && <div className="invalid-feedback">Available from date is required</div>}
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="availableUntil" className="form-label">
                                                Available Until
                                            </label>
                                            <input
                                                id="availableUntil"
                                                type="datetime-local"
                                                value={quiz.availableUntil}
                                                onChange={handleChange}
                                                className={`form-control ${errors.availableUntil ? 'is-invalid' : ''}`}
                                            />
                                            {errors.availableUntil && <div className="invalid-feedback">Available until date is required</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>








                        <br /><br /><br /><br />

                    </div>
                </div>
                <div className="tab-pane fade" id="questions">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-6">
                                <div className="d-flex mb-3">
                                    {/* question type selector */}
                                    <select
                                        className="form-select me-2"
                                        style={{ width: 'auto' }}
                                        onChange={(e) => setSelectedQuestionType(e.target.value)}
                                        value={selectedQuestionType}
                                    >
                                        <option value="">Select question type</option>
                                        <option value="multiple-choice">Multiple Choice</option>
                                        <option value="true-false">True/False</option>
                                        <option value="fill-in-blank">Fill-in-the-Blank</option>
                                    </select>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => addNewQuestion(selectedQuestionType)}
                                        disabled={!selectedQuestionType}
                                    >
                                        + Add Question
                                    </button>
                                </div>

                                {/* question list */}
                                {quiz.questions.map((question, index) => (
                                    <div key={question.id} className="card mb-3">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between">
                                                <div>

                                                    <h5 className="card-title text-dark">
                                                        Question {index + 1}
                                                    </h5>
                                                    <p className="text-muted">
                                                        {question.type === 'multiple-choice' ? 'Multiple Choice Question' : question.type === 'true-false' ? 'True/False Question' : question.type === 'fill-in-blank' ? 'Fill-in-the-Blank Question' : 'Unknown Question Type'}
                                                    </p>
                                                </div>
                                            </div>
                                            <hr />
                                            {(() => {
                                                switch (question.type) {
                                                    case 'multiple-choice':
                                                        return (
                                                            <MultipleChoiceQuestion
                                                                question={question}
                                                                onUpdate={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
                                                                onDelete={() => deleteQuestion(question.id)}

                                                            />
                                                        );
                                                    case 'true-false':
                                                        return (
                                                            <TrueFalseQuestion
                                                                question={question}
                                                                onUpdate={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
                                                                onDelete={() => deleteQuestion(question.id)}
                                                            />
                                                        );
                                                    case 'fill-in-blank':
                                                        return (
                                                            <FillInBlankQuestion
                                                                question={question}
                                                                onUpdate={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
                                                                onDelete={() => deleteQuestion(question.id)}
                                                            />
                                                        );
                                                    default:
                                                        return null;
                                                }
                                            })()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Move cancel/save buttons outside of tab content */}
            <div className="d-flex justify-content-end mt-4">
                <button onClick={handleCancel} className="btn btn-secondary me-2">Cancel</button>
                <button onClick={handleSave} className="btn btn-primary btn-danger">Save</button>
                
            </div>
        </div >
    );
}