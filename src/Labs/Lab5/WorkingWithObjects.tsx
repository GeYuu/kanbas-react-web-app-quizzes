import React, { useState } from "react";
const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;
export default function WorkingWithObjects() {
    const [assignment, setAssignment] = useState({
        id: 1, title: "NodeJS Assignment",
        description: "Create a NodeJS server with ExpressJS",
        due: "2021-10-10", completed: false, score: 0,
    });
    const [module, setModule] = useState({
        id: 1, name: "NodeJS", description: "NodeJS Modules",
    });

    const ASSIGNMENT_API_URL = `${REMOTE_SERVER}/lab5/assignment`
    return (
        <div>
            <h3 id="wd-working-with-objects">Working With Objects</h3>
            <h4>Retrieving Objects</h4>
            <a id="wd-retrieve-assignments" className="btn btn-primary"
                href={`${REMOTE_SERVER}/lab5/assignment`}>
                Get Assignment
            </a><hr />
            <h4>Retrieving Properties</h4>
            <a id="wd-retrieve-assignment-title" className="btn btn-primary"
                href={`${REMOTE_SERVER}/lab5/assignment/title`}>
                Get Title
            </a><hr />


            <h4>Modifying Assignment Title</h4>

            <input className="form-control w-75" id="wd-assignment-title"
                value={assignment.title} onChange={(e) =>
                    setAssignment({ ...assignment, title: e.target.value })} />
            <a id="wd-update-assignment-title"
                className="btn btn-primary"
                href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}>
                Update Title
            </a>
            <hr />


            <h4>Modifying Assignment Due Date</h4>
            <input className="form-control w-75" id="wd-assignment-score"
                value={assignment.score} onChange={(e) =>
                    setAssignment({ ...assignment, score: Number(e.target.value) })} />
            <a id="wd-update-assignment-score"
                className="btn btn-primary"
                href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}>
                Update Score
            </a>
            <hr />

            <h4>Modifying Assignment Due Date</h4>
            <input type="checkbox" id="wd-assignment-completed"
                checked={assignment.completed} onChange={(e) =>
                    setAssignment({ ...assignment, completed: e.target.checked })} />

            <br />
            <a id="wd-update-assignment-completed"
                className="btn btn-primary"
                href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}>
                Update Completed
            </a>
            <hr />

            <h4>Modifying Assignment Description</h4>
            <input className="form-control w-75" id="wd-assignment-description"
                value={assignment.description} onChange={(e) =>
                    setAssignment({ ...assignment, description: e.target.value })} />
            <a id="wd-update-assignment-description"
                className="btn btn-primary"
                href={`${ASSIGNMENT_API_URL}/description/${assignment.description}`}>
                Update Description
            </a>
            <hr />









            <h4>Get Module</h4>
            <a id="wd-get-assignment"
                className="btn btn-primary "
                href={`${REMOTE_SERVER}/lab5/module`}>
                Get Module
            </a>
            <hr />

            <h4>Get Module Name</h4>
            <a id="wd-get-assignment-name"
                className="btn btn-primary"
                href={`${REMOTE_SERVER}/lab5/module/name`}>
                Get Module Name
            </a>
            <hr />

            <h4>Modifying Module Name</h4>
            <a id="wd-update-module-name"
                className="btn btn-primary"
                href={`${REMOTE_SERVER}/lab5/module/name/${module.name}`}>
                Update Module Name
            </a>
            <input className="form-control w-75" id="wd-module-name"
                value={module.name} onChange={(e) =>
                    setModule({ ...module, name: e.target.value })} />
            <hr />




        </div>
    );
}
