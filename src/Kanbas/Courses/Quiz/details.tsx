import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { FaPencilAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import { format, parseISO } from 'date-fns';




interface User {
    _id: string;
    username: string;
    role: string;
}

export default function QuizDetails() {

    const { qid } = useParams();
    const currentUser = useSelector((state: RootState) => state.accountReducer.currentUser) as User | null;
    const quiz = useSelector((state: any) => state.quizzes.quizzes.find((q: any) => q._id === qid));
    const navigate = useNavigate();


    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A'; // Handle cases where the date might be undefined or null

        const parsedDate = parseISO(dateString); // Parses the ISO string into a Date object

        if (isNaN(parsedDate.getTime())) {
            return dateString; // Return the original string if the date is invalid
        }

        return format(parsedDate, 'MMM d \'at\' h:mmaaa');
    };


    return (
        <div>



            <div className="quiz-controls mt-3">
                <div className="row">

                    <div className="col-6 text-end">
                        {/* // quiz controls
            //for faculty, show edit and review
            //for students, show take quiz */}
                        {currentUser?.role === "FACULTY" ? (
                            <>
                                <button className="btn me-2 btn-secondary
                                ">Preview</button>
                                <button className="btn btn-secondary"
                                    onClick={() => navigate(`/Kanbas/Courses/${quiz.course}/quizzes/edit/${quiz._id}`)}
                                >
                                    <FaPencilAlt className="me-2"
                                    />
                                    Edit</button>
                            </>
                        ) : (
                            <button className="btn btn-primary">Take Quiz</button>
                        )}

                    </div>
                </div>
            </div>



            <hr />



            <div className="quiz-details container mt-3">


                <div className="quiz-header-name row mt-3 mb-5">
                    <h2><b>{quiz.title}</b></h2>
                </div>







                {/* Quiz type */}
                <div className="quiz-details-quizType  row 
                            ">
                    <h5 className="col-md-4 text-end text-dark font-weight-bold"
                    >
                        <b>Quiz Type</b>
                    </h5>
                    <p className="col-md-6"
                    >{quiz.quizType}</p>
                </div>

                {/* Points */}
                <div className="quiz-details-points  row 
                            ">
                    <h5 className="col-md-4 text-end text-capitalize">
                        <b>Points</b>
                    </h5>

                    <p className="col-md-6"
                    >{quiz.points}</p>
                </div>

                {/* Assignment Group */}
                <div className="quiz-details-assignmentGroup  row 
                            ">
                    <h5 className="col-md-4 text-end"
                    ><b>Assignment Group</b></h5>
                    <p className="col-md-6"
                    >{quiz.assignmentgroup}</p>
                </div>

                {/* shuffle answers */}
                <div className="quiz-details-shuffleAnswers  row 
                            ">
                    <h5 className="col-md-4 text-end"
                    ><b>Shuffle Answers</b></h5>
                    <p className="col-md-6"
                    >{quiz.shuffleAnswers ? "Yes" : "No"}</p>
                </div>

                {/* Time Limit */}
                <div className="quiz-details-timeLimit row">
                    <h5 className="col-md-4 text-end"><b>Time Limit</b></h5>
                    <p className="col-md-6">
                        {quiz.timeLimit === true ? `${quiz.timeLimitEntry} minutes` : 'No time limit'}
                    </p>
                </div>

                {/* Multiple Attempts */}
                <div className="quiz-details-multipleAttempts  row 
                            ">
                    <h5 className="col-md-4 text-end"
                    ><b>Multiple Attempts</b></h5>
                    <p className="col-md-6"
                    >{quiz.allowMultipleAttempts ? "Yes" : "No"}</p>
                </div>


                {/* show correct answers */}
                <div className="quiz-details-showCorrectAnswers  row 
                            ">
                    <h5 className="col-md-4 text-end"
                    ><b>Show Correct Answers</b></h5>
                    <p className="col-md-6"
                    >{quiz.showCorrectAnswers ? "Yes" : "No"}</p>
                </div>

                {/* access code */}
                <div className="quiz-details-accessCode  row 
                            ">
                    <h5 className="col-md-4 text-end"
                    ><b>Access Code</b></h5>
                    <p className="col-md-6"
                    >{quiz.accessCode === true ? quiz.accessCodeEntry : 'Not Required'}</p>
                </div>

                {/* one question at a time */}
                <div className="quiz-details-oneQuestionAtATime  row 
                            ">
                    <h5 className="col-md-4 text-end"
                    ><b>One Question at a Time</b></h5>
                    <p className="col-md-6"
                    >{quiz.oneQuestionAtATime ? "Yes" : "No"}</p>
                </div>

                {/* web cam required */}
                <div className="quiz-details-webCamRequired  row 
                            ">
                    <h5 className="col-md-4 text-end"
                    ><b>Web Cam Required</b></h5>
                    <p className="col-md-6"
                    >{quiz.webCamRequired ? "Yes" : "No"}</p>
                </div>

                {/* lock questions after answering */}
                <div className="quiz-details-lockQuestionsAfterAnswering  row 
                            ">
                    <h5 className="col-md-4 text-end"
                    ><b>Lock Questions After Answering</b></h5>
                    <p className="col-md-6"
                    >{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</p>
                </div>

                {/* table show due, for, available from, until */}












            </div>


            <div className="table-container">


                <table className="table w-100">
                    <thead>
                        <tr>
                            <td><b>Due</b></td>
                            <td><b>For</b></td>
                            <td><b>Available From</b></td>
                            <td><b>Until</b></td>
                        </tr>


                    </thead>

                    <tbody>

                        <tr>
                            <td>{formatDate(quiz.dueDate)}</td>
                            <td>{"Everyone"}</td>
                            <td>{formatDate(quiz.availableFrom)}</td>
                            <td>{formatDate(quiz.availableUntil)}</td>
                        </tr>
                    </tbody>

                </table>
            </div>
        </div>

    );
}

