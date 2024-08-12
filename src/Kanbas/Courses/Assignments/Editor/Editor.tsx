import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from "react";
import { addAssignment, updateAssignment } from "../reducer";
import * as client from "../client";
type Assignment = {
  _id: string;
  title: string;
  course: string;
  description?: string;
  points?: number;
  dueDate?: string;
  availableFrom?: string;
  availableUntil?: string;
};

export default function AssignmentEditor() {
  const { cid, id } = useParams<{ cid: string, id: string }>();
  const assignments = useSelector(
    (state: { assignments: { assignments: Assignment[] } }) => state.assignments.assignments);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const createAssignment = async (assignment: any) => {
    const newAssignment = await client.createAssignment(cid as string, assignment);
    dispatch(addAssignment(newAssignment));
  };

  const saveAssignment = async (assignment: any) => { 
    const updatedAssignment = await client.updateAssignment(cid as string, assignment);
    dispatch(updateAssignment(assignment));
  };

  const existingAssignment = assignments.find(a => a._id === id);

  const [assignment, setAssignment] = useState<Assignment>({
    _id: existingAssignment?._id || new Date().getTime().toString(),
    title: existingAssignment?.title || '',
    course: existingAssignment?.course || cid!,
    description: existingAssignment?.description || '',
    points: existingAssignment?.points || 0,
    dueDate: existingAssignment?.dueDate || '',
    availableFrom: existingAssignment?.availableFrom || '',
    availableUntil: existingAssignment?.availableUntil || '',
  })

  const handleCancel = () => {
    navigate(`/Kanbas/Courses/${cid}/Assignments`);
  };

  const handleSave = () => {

    if (id && existingAssignment) {
      saveAssignment(assignment);
    } else {
      createAssignment(assignment);
    }
    navigate(`/Kanbas/Courses/${cid}/Assignments`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAssignment({ ...assignment, [e.target.id]: e.target.value });
  };

  return (
    <div id="wd-assignments-editor">
      <div className="row">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Assignment Name
          </label>
          <input
            id="title"
            value={assignment.title}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <textarea
            id="description"
            className="form-control"
            rows={6}
            value={assignment.description}
            onChange={handleChange}
          />
        </div>
        <div className="col-3 mb-4">
          <label htmlFor="points" className="form-label float-end">
            Points
          </label>
        </div>
        <div className="col-9 mb-4">
          <div className="form-group d-flex">
            <input
              id="points"
              type="number"
              value={assignment.points}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
        <div className="col-3 mb-4">
          <label htmlFor="dueDate" className="form-label float-end">
            Due
          </label>
        </div>
        <div className="col-9 mb-4">
          <div className="mb-3">
            <label htmlFor="dueDate" className="form-label">
              Due Date
            </label>
            <input
              id="dueDate"
              type="datetime-local"
              value={assignment.dueDate}
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
                value={assignment.availableFrom}
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
                value={assignment.availableUntil}
                onChange={handleChange}
                className="form-control"
              />
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
  );
}
