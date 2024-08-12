import axios from "axios";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
const ASSIGNMENTS_API = `${REMOTE_SERVER}/api/courses`;

export const findAssignmentsForCourse = async (courseId: string) => {
  const response = await axios.get(`${ASSIGNMENTS_API}/${courseId}/assignments`);
  return response.data;
};

export const createAssignment = async (courseId: string, assignment: any) => {
  try {
    const response = await axios.post(`${ASSIGNMENTS_API}/${courseId}/assignments`, assignment);
    console.log('Response from server:', response.data);  // Logging the response
    return response.data;
  } catch (error) {
    console.error('Error creating assignment:', error);  // Logging the error
  }
};

export const deleteAssignment = async (courseId: string, assignmentId: string) => {
  try {
    const response = await axios.delete(`${ASSIGNMENTS_API}/${courseId}/assignments/${assignmentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting assignment:', error);  // Logging the error
  }
};

export const updateAssignment = async (courseId: string, assignment: any) => {
  const response = await axios.put(`${ASSIGNMENTS_API}/${courseId}/assignments/${assignment._id}`, assignment);
  return response.data;
};
