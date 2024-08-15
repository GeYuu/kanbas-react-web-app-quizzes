import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from "react";
import { addQuiz, updateQuiz } from "./reducer";
import * as client from "./client";
import { BsGripVertical } from "react-icons/bs";
import { MdDoNotDisturbAlt } from "react-icons/md";
import './styles.css';
import Editor from 'react-simple-wysiwyg';

type Quiz = {
    quizType: string;
    assignmentgroup: string;
    shuffleAnswers: string;
    timeLimit: string;
    timeLimitEntry: number;
    allowMultipleAttempts: string;
    showCorrectedAnswers: string;
    accessCode: string;
    accessCodeEntry: number;
    oneQuestionAtATime: string;
    webCamRequired: string;
    lockQuestionsAfterAnswering: string;
    _id: string;
    title: string;
    course: string;
    questions: any[];
    description?: string;
    points?: number;
    dueDate?: string;
    availableFrom?: string;
    availableUntil?: string;

};

export default function QuizEditor() {
    const { cid, id } = useParams<{ cid: string, id: string }>();

    console.log(cid, id);
    const quizzes = useSelector(
        (state: { quizzes: { quizzes: Quiz[] } }) => state.quizzes.quizzes);
    const [html, setHtml] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const createQuiz = async (quiz: any) => {
        const newQuiz = await client.createQuiz(cid as string, { ...quiz, course: cid });
        dispatch(addQuiz(newQuiz));
    }

    const saveQuiz = async (quiz: any) => {
        const updatedQuiz = await client.updateQuiz(cid as string, { ...quiz, course: cid });
        dispatch(updateQuiz(updatedQuiz));
    }

    const existingQuiz = quizzes.find(a => a._id === id);

    const [quiz, setQuiz] = useState<Quiz>({
        quizType: existingQuiz?.quizType || 'Graded Quiz',
        assignmentgroup: existingQuiz?.assignmentgroup || 'Quizzes',
        shuffleAnswers: existingQuiz?.shuffleAnswers ?? 'true',
        timeLimit: existingQuiz?.timeLimit || 'true',
        timeLimitEntry: existingQuiz?.timeLimitEntry || 20,
        allowMultipleAttempts: existingQuiz?.allowMultipleAttempts || 'false',
        showCorrectedAnswers: existingQuiz?.showCorrectedAnswers || 'false',
        accessCode: existingQuiz?.accessCode || 'false',
        accessCodeEntry: existingQuiz?.accessCodeEntry || 0,
        oneQuestionAtATime: existingQuiz?.oneQuestionAtATime || 'true',
        webCamRequired: existingQuiz?.webCamRequired || 'false',
        lockQuestionsAfterAnswering: existingQuiz?.lockQuestionsAfterAnswering || 'false',
        _id: existingQuiz?._id || new Date().getTime().toString(),
        title: existingQuiz?.title || "unnamed quiz",
        course: existingQuiz?.course || cid!,
        questions: existingQuiz?.questions || [],
        description: existingQuiz?.description || '',
        points: existingQuiz?.points || 0,
        dueDate: '',
        availableFrom: '',
        availableUntil: ''
    });

    const handleCancel = () => {
        navigate(`/Kanbas/Courses/${cid}/quizzes`);
    };

    const handleSave = () => {

        if (id && existingQuiz) {
            saveQuiz({ ...quiz, course: cid });
        } else {
            createQuiz({ ...quiz, course: cid });
        }
        navigate(`/Kanbas/Courses/${cid}/quizzes`);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | any>) => {
        const { id, value, type, checked } = e.target;

        setQuiz({
            ...quiz,
            [id]: type === 'checkbox' ? checked : value
        });
    };


    function onChange(e: any) {
        setHtml(e.target.value);
    }



    return (
        <div id="wd-quiz-editor">


            <div className="row justify-content-end align-items-center mb-4">
                <div className="col-auto">
                    <span className="fw-bold me-2">Points</span>
                    {quiz.points}
                </div>
                <div className="col-auto">
                    <span className="text-muted">
                        <MdDoNotDisturbAlt
                            style={{ color: "gray" }}
                            className="me-2" />

                        Not Published</span>
                </div>
                <div className="col-auto">
                    <button className="btn btn-light">
                        <BsGripVertical />
                    </button>
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

                            <input
                                id="title"
                                value={quiz.title}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Unnamed Quiz"
                            />
                        </div>

                        <div className="mb-3">

                            <label htmlFor="description" className="form-label">
                                Quiz Instructions:
                            </label>
                            <Editor
                                value={quiz.description}
                                className="editor"
                                onChange={handleChange}

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
                                        value={quiz.shuffleAnswers}
                                        onChange={handleChange}
                                        id="ShuffleAnswers"
                                        defaultChecked
                                    />
                                    <label className="form-check-label mb-0 col-md-6"
                                        htmlFor="ShuffleAnswers">
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
                                            value={quiz.timeLimit}
                                            onChange={handleChange}
                                            id="TimeLimit"
                                            defaultChecked
                                        />
                                        <label className="form-check-label me-4"
                                            htmlFor="TimeLimit">
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
                                    <input className="form-check-input me-2"
                                        type="checkbox"
                                        value={quiz.allowMultipleAttempts}
                                        onChange={handleChange}
                                        id="AllowMultipleAttempts"
                                    />
                                    <label className="form-check-label"
                                        htmlFor="AllowMultipleAttempts">
                                        Allow Multiple Attempts
                                    </label>
                                </div>
                            </div>

                            <div className="row mb-3 ">
                                <div className="col-md-4">
                                </div>
                                <div className="col-md-8">
                                    <input className="form-check-input me-2"
                                        type="checkbox"
                                        value={quiz.showCorrectedAnswers}
                                        onChange={handleChange}
                                        id="ShowCorrectedAnswers"
                                    />
                                    <label className="form-check-label" htmlFor="ShowCorrectedAnswers">
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
                                            value={quiz.accessCode}
                                            onChange={handleChange}
                                            id="AccessCode"
                                        />
                                        <label className="form-check-label me-5" htmlFor="AccessCode">
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
                                        value={quiz.oneQuestionAtATime}
                                        onChange={handleChange}
                                        id="oneQuestionAtATime"
                                        defaultChecked
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
                                        value={quiz.webCamRequired}
                                        onChange={handleChange}
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
                                        value={quiz.lockQuestionsAfterAnswering}
                                        onChange={handleChange}
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
                                            className="form-control"
                                        />
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
                                                className="form-control"
                                            />
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
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>








                        <br /><br /><br /><br />
                        <div className="d-flex justify-content-end">
                            <button onClick={handleCancel} className="btn btn-secondary me-2">Cancel</button>
                            <button onClick={handleSave} className="btn btn-primary btn-danger">Save</button>
                        </div>
                    </div>
                </div>
                <div className="tab-pane fade" id="questions">
                    {/* <QuestionsTab /> */}
                </div>
            </div>



        </div >
    );
}