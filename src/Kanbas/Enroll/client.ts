import axios from "axios";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const USERS_API = `${REMOTE_SERVER}/api/users`;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;

export const fetchAllCourses = async () => {
    const response = await axios.get(`${COURSES_API}`);
    return response.data;
};

export const enrollInCourse = async (userId: string, courseId: string) => {
    const response = await axios.put(`${USERS_API}/enroll/${userId}/${courseId}`);
    return response.data;
};
