import axios from "axios";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;


const QUIZ_API = `${REMOTE_SERVER}/api`;

export const findQuizzesForCourse = async (courseId: string) => {
    const response = await axios
        .get(`${QUIZ_API}/courses/${courseId}/quizzes`);
    return response.data;
};

export const findQuizById = async (quizId: string) => {
    const response = await axios
        .get(`${QUIZ_API}/quizzes/${quizId}`);
    return response.data;
};

export const deleteQuiz = async (courseId: string, quizId: string) => {
    const response = await axios
        .delete(`${QUIZ_API}/quizzes/${quizId}`);
    return response.data;
}

export const createQuiz = async (courseId: string, quiz: any) => {
    try {
        const response = await axios.post(`${QUIZ_API}/quizzes`, quiz);
        return response.data;
    } catch (error) {
        console.error("Error creating quiz:", error);
        throw error;
    }
}


export const updateQuiz = async (courseId: string, quiz: any) => {
    const response = await axios
        .put(`${QUIZ_API}/quizzes/${quiz._id}`, quiz);
    return response.data;
}

export const publishQuiz = async (courseId: string, quizId: string) => {
    const response = await axios
        .put(`${QUIZ_API}/quizzes/${quizId}/publish`);
    return response.data;
}

export const submitQuiz = async (quizTaken: any, quizId: string) => {
    const response = await axios
        .post(`${QUIZ_API}/quizzes-taken`, quizTaken);
    return response.data;
}

export const findQuizTakenByQuizId = async (quizId: string) => {
    const response = await axios
        .get(`${QUIZ_API}/quizzes-taken/${quizId}`);
    return response.data;
}

export const findQuizTakenById = async (id: string) => {
    const response = await axios
        .get(`${QUIZ_API}/quizzes-taken/${id}`);
    return response.data;
}

export const NumOfAttempts = async (quizId: string, userId: string) => {
    const response = await axios
        .get(`${QUIZ_API}/quizzes-taken/num-of-attempts/${quizId}/${userId}`);
    return response.data;
}

export const findQuizTakenByUserId = async (userId: string) => {
    const response = await axios
        .get(`${QUIZ_API}/quizzes-taken/student/${userId}`);
    return response.data;
}

export const findLastAttemptScore = async (quizId: string, userId: string) => {
    const response = await axios
        .get(`${QUIZ_API}/quizzes-taken/last-attempt-score/${quizId}/${userId}`);
    return response.data;
}

export const findAllQuizzesTakenByQuizIdAndUserId = async (quizId: string, userId: string) => {
    const response = await axios
        .get(`${QUIZ_API}/quizzes-taken/all/${quizId}/${userId}`);
    return response.data;
}









