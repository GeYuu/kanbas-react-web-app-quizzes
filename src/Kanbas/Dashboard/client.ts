import axios from "axios";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const USERS_API = `${REMOTE_SERVER}/api/users`;
const COURSES_API = `${REMOTE_SERVER}/api/courses`;

export const fetchEnrolledCourses = async (userId: string) => {
    const response = await axios.get(`${USERS_API}/enrolled/${userId}`);
    return response.data.courses;
}