import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { fetchEnrolledCourses } from "./client";
import { useSelector } from "react-redux";
import { RootState } from '../store';

interface User {
  _id: string;
  username: string;
  role: string;
}

export default function Dashboard(
  { courses, course, setCourse, addNewCourse,
    deleteCourse, updateCourse
  }: {
    courses: any[];
    course: any;
    setCourse: (course: any) => void;

    addNewCourse: (userId: string) => void;
    deleteCourse: (course: any) => void;
    updateCourse: () => void;
  }) {

  // Retrieve the current user from Redux
  const currentUser = useSelector((state: RootState) => state.accountReducer.currentUser) as User | null;

  // State to store the enrolled course IDs
  const [enrolledCourseIDs, setEnrolledCourseIDs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch the enrolled courses when the component mounts
  useEffect(() => {
    if (currentUser) {
      findEnrolledCourses();
    }
  }, [currentUser]);

  const findEnrolledCourses = async () => {
    try {
      const fetchedEnrolledCourseIDs = await fetchEnrolledCourses(currentUser?._id || "");

      // Ensure that fetchedEnrolledCourseIDs is always an array
      if (Array.isArray(fetchedEnrolledCourseIDs)) {
        setEnrolledCourseIDs(fetchedEnrolledCourseIDs);
      } else {
        setEnrolledCourseIDs([]);
        //console.log(fetchedEnrolledCourseIDs);
        setError("Unexpected response format. Could not load enrolled courses.");
      }
    } catch (err: any) {
      console.error("Failed to fetch enrolled courses:", err.message);
      setEnrolledCourseIDs([]);
      setError("Failed to fetch enrolled courses.");
    }
  };

  const handleAddNewCourse = async () => {
    try {
      setError(null); // Clear any previous errors

      // Check if the user is faculty
      if (currentUser?.role !== "FACULTY") {
        setError("Only faculty can add new courses.");
        return;
      }

      // Pass the currentUser._id (userid) when adding a new course
      await addNewCourse(currentUser._id);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred while adding the course");
    }
  };

  const handleUpdateCourse = async () => {
    try {
      setError(null); // Clear any previous errors

      // Check if the user is faculty
      if (currentUser?.role !== "FACULTY") {
        setError("Only faculty can update courses.");
        return;
      }

      // Pass the currentUser._id (userid) when updating a course
      await updateCourse();
    }
    catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred while updating the course");
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    try {
      setError(null); // Clear any previous errors

      // Check if the user is faculty
      if (currentUser?.role !== "FACULTY") {
        setError("Only faculty can delete courses.");
        return;
      }

      // Prompt for confirmation
      const isConfirmed = window.confirm("Are you sure you want to delete this course?");
      
      if (isConfirmed) {
        // Pass the currentUser._id (userid) when deleting a course
        await deleteCourse(courseId);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred while deleting the course");
    }
  }
  


  // Filter the courses to only include those that the user is enrolled in
  const filteredCourses = courses.filter(course => enrolledCourseIDs.includes(course._id));

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1>
      <hr />
      {error && <div className="alert alert-danger">{error}</div>}
      <h5>Course Management</h5>

      {/* Enroll Link */}
      <Link to="/Kanbas/Enroll" className="btn btn-primary">Enroll</Link>

      <hr />
      <div> currentUserId: {currentUser?._id} </div>
      <div> Your Name: {currentUser?.username} </div>
      <div> Your Role: {currentUser?.role} </div>

      <hr />
      {currentUser?.role === "FACULTY" && (
        <>
          <h5>New Course
            <button className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={handleAddNewCourse} > Add </button>
            <button className="btn btn-warning float-end me-2"
              onClick={handleUpdateCourse} id="wd-update-course-click">
              Update
            </button>
          </h5><br />

          <label htmlFor="courseId">Course ID</label>
          <input value={course._id} className="form-control mb-2"
            onChange={(e) => setCourse({ ...course, _id: e.target.value })} />
          <label htmlFor="courseName">Course Name</label>
          <input value={course.name} className="form-control mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })} />
          <label htmlFor="courseDescription">Course Description</label>
          <textarea value={course.description} className="form-control"
            onChange={(e) => setCourse({ ...course, description: e.target.value })} />
        </>
      )}

      <h2 id="wd-dashboard-enrolled">Enrolled Courses ({filteredCourses.length})</h2>
      <hr />
      <div id="wd-dashboard-courses" className="row">
        <div className="row row-cols-1 row-cols-md-5 g-4">
          {filteredCourses.map((course, index) => (
            <div className="wd-dashboard-course col" key={index} style={{ width: "300px" }}>
              <Link to={`/Kanbas/Courses/${course._id}/Home`} className="text-decoration-none" >
                <div className="card rounded-3 overflow-hidden">
                  <img src={`${course.imagePath}`}
                    className="card-img-top" alt={`Course ${course.name}`}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = "/images/reactjs.jpg";
                    }}
                    width={300} height={200}
                  />
                  <div className="card-body">
                    <span className="wd-dashboard-course-link"
                      style={{ textDecoration: "none", color: "navy", fontWeight: "bold" }} >
                      {course.name}
                    </span>
                    <p className="wd-dashboard-course-title card-text" style={{ maxHeight: 53, overflow: "hidden" }}>
                      {course.description}
                    </p>
                    <Link to={`/Kanbas/Courses/${course._id}/Home`} className="btn btn-primary">Go</Link>
                    <button id="wd-edit-course-click"
                      onClick={(event) => {
                        event.preventDefault();
                        setCourse(course);
                        handleUpdateCourse();
                      }}
                      className="btn btn-warning me-2 float-end" >
                      Edit
                    </button>

                    <button onClick={(event) => {
                      event.preventDefault();
                      handleDeleteCourse(course._id);
                    }} className="btn btn-danger float-end me-2"
                      id="wd-delete-course-click">
                      Delete
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}