import { useParams } from "react-router-dom";
import * as db from "../../Database";
import { FaFileImport, FaFileExport, FaCog } from 'react-icons/fa';

export default function Grades() {
  const { cid } = useParams();

  const enrollments = db.enrollments.filter(enrollment => enrollment.course === cid);
  
  const enrolledUsers = db.users.filter(user => 
    enrollments.some(enrollment => enrollment.user === user._id)
  );

  const assignments = db.assignments.filter(assignment => assignment.course === cid);

  return (
    <div className="container mt-4">
      <div className="col-12 mb-4 d-flex justify-content-end">
        <div className="btn-group">
          <button className="btn btn-secondary">
            <FaFileImport className="me-1" /> Import
          </button>
          <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
              <FaFileExport className="me-1" /> Export
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li><a className="dropdown-item" href="#">Export as CSV</a></li>
              <li><a className="dropdown-item" href="#">Export as PDF</a></li>
            </ul>
          </div>
          <button className="btn btn-secondary">
            <FaCog />
          </button>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="student-names" className="form-label">Student Names</label>
          <input id="student-names" className="form-control" type="search" placeholder="Search Students" />
        </div>
        <div className="col-md-6">
          <label htmlFor="assignment-names" className="form-label">Assignment Names</label>
          <input id="assignment-names" className="form-control" type="search" placeholder="Search Assignments" />
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Student Name</th>
              {assignments.map((assignment) => (
                <th key={assignment._id}>{assignment.title}<br /> Out of 100</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {enrolledUsers.map((user) => (
              <tr key={user._id}>
                <td>{`${user.firstName} ${user.lastName}`}</td>
                {assignments.map((assignment) => (
                  <td key={assignment._id}>
                    {db.grades.find((grade) => grade.assignment === assignment._id && grade.student === user._id)?.grade || "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
