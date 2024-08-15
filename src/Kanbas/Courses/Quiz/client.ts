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