import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as client from "./client";
import { RootState } from '../store';

interface Course {
    _id: string;
    name: string;
}

interface User {
    _id: string;
    username: string;

}

export default function Enroll() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [enrollmentMessage, setEnrollmentMessage] = useState("");

    // Retrieve the current user from Redux
    const currentUser = useSelector((state: RootState) => state.accountReducer.currentUser) as User | null;

    const fetchCourses = async () => {
        try {
            const fetchedCourses = await client.fetchAllCourses();
            //console.log(fetchedCourses);
            setCourses(fetchedCourses);
        } catch (err: any) {
            console.error("Failed to fetch courses:", err.message);
            setEnrollmentMessage("Failed to load courses. Please try again later.");
        }
    };

    const handleEnroll = async () => {
        if (!selectedCourse) {
            setEnrollmentMessage("Please select a course to enroll.");
            return;
        }

        try {
            if (!currentUser || !currentUser.username) {
                setEnrollmentMessage("No user is logged in.");
                return;
            }

            await client.enrollInCourse(currentUser._id, selectedCourse);
            setEnrollmentMessage("Successfully enrolled in the course!");
        } catch (err: any) {
            //console.error("Enrollment failed", err);

            
            setEnrollmentMessage(err.response.data.message);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    return (
        <div>
            <h1>Enroll</h1>
            <hr />
            <h5>Enroll in a course</h5>
            <div className="form-group">
                <label htmlFor="course">Course</label>
                <select
                    id="course"
                    className="form-control"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                >
                    <option value="">Select a course</option>
                    {courses.map((course: Course) => (
                        <option key={course._id} value={course._id}>
                            
                            {course.name} ({course._id})
                        </option>
                    ))}
                </select>
            </div>

            <button onClick={handleEnroll} className="btn btn-primary mt-3">
                Enroll
            </button>

            <button onClick={() => window.history.back()} className="btn btn-danger mt-3 ms-2">
                Back
            </button>

            {enrollmentMessage && (
                <div className="mt-3 alert alert-info">
                    {enrollmentMessage}
                </div>
            )}
        </div>
    );
}
