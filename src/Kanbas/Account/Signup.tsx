import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as client from "./client";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
export default function Signup() {
    const [error, setError] = useState("");
    const [user, setUser] = useState<any>({});
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const signup = async () => {
        
        if (!FieldCheck()) return;

        try {
            const currentUser = await client.signup(user);
            dispatch(setCurrentUser(currentUser));
            navigate("/Kanbas/Account/Profile");
        } catch (err: any) {
            setError(err.response.data.message);
        }
    }

    const FieldCheck = () => {
        //chekc if all fields are filled
        if (!user.username || !user.password || !user.firstName || !user.lastName || !user.role) {
            setError("Please fill all fields");
            return false;
        }
        return true;
    


    };


    return (
        <div className="wd-signup-screen"> 
            <h1>Sign up</h1>
            {error && <div className="wd-error alert alert-danger">{error}</div>}
            <div
                className="d-flex flex-column w-50 border rounded p-3">
                {/* username */}
                <div className="wd-username form-group mb-2 ">
                    <b>Username</b>
                </div>
                <input value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })}
                    className="wd-username form-control mb-2 " placeholder="username" />
                {/* password */}
                <div className="wd-password form-group mb-2 ">
                    <b>Password</b>
                </div>
                <input value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} type="password"
                    className="wd-password form-control mb-2 " placeholder="password" />

                {/* firstName */}
                <div className="wd-first-name form-group mb-2 ">
                    <b>First Name</b>
                </div>
                <input value={user.firstName} onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                    className="wd-first-name form-control mb-2 " placeholder="firstName" />
                {/* lastName */}
                <div className="wd-last-name form-group mb-2 ">
                    <b>Last Name</b>
                </div>
                <input value={user.lastName} onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                    className="wd-last-name form-control mb-2 " placeholder="lastName" />
                {/* role radio: faculty or student */}
                <div className="wd-role form-group mb-2 ">
                    <b>Role</b>
                </div>
                <div className="wd-role form-check mb-2 d-flex ">
                    <div >
                        <input
                            type="radio"
                            id="faculty"
                            name="role"
                            value="FACULTY"
                            onChange={(e) => setUser({ ...user, role: e.target.value })}
                            className="form-check-input"
                        />
                        <label htmlFor="faculty" className="form-check-label">Faculty</label>
                    </div>


                    <div className="form-check ms-3 ">
                        <input
                            type="radio"
                            id="student"
                            name="role"
                            value="STUDENT"
                            onChange={(e) => setUser({ ...user, role: e.target.value })}
                            className="form-check-input"
                        />
                        <label htmlFor="student" className="form-check-label">Student</label>
                    </div>


                </div>




                <button onClick={signup} className="wd-signup-btn btn btn-primary mb-2"> Sign up </button><br />
                <Link to="/Kanbas/Account/Signin" className="wd-signin-link">Sign in</Link>
            </div>
        </div>
    );
}
