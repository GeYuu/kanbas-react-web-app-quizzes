import * as client from "./client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";


export default function Profile() {
    //error message
    const [error, setError] = useState("");
    //success update message
    const [success, setSuccess] = useState("");
    const [profile, setProfile] = useState<any>({});
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchProfile = async () => {

        try {
            const account = await client.profile();
            setProfile(account);
          } catch (err: any) {
            navigate("/Kanbas/Account/Signin");
          }
      

    };

    const signout = async () => {
        await client.signout();
        dispatch(setCurrentUser(null));
        navigate("/Kanbas/Account/Signin");
    };



    const updateProfile = async () => {
        if (!FieldCheck()) {
            setError("Please fill all fields");
            setSuccess("");
            return;
        }


        try {
            const updatedProfile = await client.updateProfile(profile);
            setProfile(updatedProfile); // Update state with new profile data
            setError("");
            setSuccess("Profile updated successfully");
            fetchProfile();
        } catch (err: any) {
            console.error(err);
            setError(err.response.data.message);
            setSuccess("");
        }
    };

    const FieldCheck = () => {
        //chekc if username, password, firstName, lastName, and role are filled
        if (!profile.username || !profile.password || !profile.firstName || !profile.lastName || !profile.role) {
            return false;
        }
        return true
    }


    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div className="wd-profile-screen">
            <h1>Profile</h1>
            {error && <div className="wd-error alert alert-danger">{error}</div>}
            {success && <div className="wd-success alert alert-success">{success}</div>}
            {profile && (
                <div
                    className="d-flex flex-column w-50 border rounded p-3">
                    <div className="wd-username form-group mb-2 ">
                        <b>Username</b>
                    </div>
                    <input className="wd-username form-control  mb-2"
                        value={profile.username}
                        onChange={(e) => setProfile({ ...profile, username: e.target.value })} />

                    <div className="wd-password form-group mb-2 ">
                        <b>Password</b>
                    </div>
                    <input className="wd-password form-control mb-2"
                        value={profile.password}
                        onChange={(e) => setProfile({ ...profile, password: e.target.value })} />

                    <div className="wd-firstname form-group mb-2 ">
                        <b>First Name</b>
                    </div>
                    <input className="wd-firstname form-control mb-2"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />

                    <div className="wd-lastname form-group mb-2 ">
                        <b>Last Name</b>
                    </div>
                    <input className="wd-lastname form-control mb-2"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />

                    <div className="wd-dob form-group mb-2 ">
                        <b>Date of Birth</b>
                    </div>
                    <input className="wd-dob form-control mb-2"
                        value={profile.dob}
                        onChange={(e) => setProfile({ ...profile, dob: e.target.value })} type="date" />


                    <div className="wd-email form-group mb-2 ">
                        <b>Email</b>
                    </div>
                    <input className="wd-email form-control mb-2"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })} />

                    <div className="wd-role form-group mb-2 ">
                        <b>Role</b>
                    </div>
                    <select className="wd-role form-control  mb-2"
                        value={profile.role}
                        onChange={(e) => setProfile({ ...profile, role: e.target.value })}>
                        <option value="FACULTY">Faculty</option>
                        <option value="STUDENT">Student</option>
                    </select>


                    <div className="d-flex mt-3 mp-2 justify-content-between">
                        {/* update button */}
                        <button onClick={updateProfile} className="wd-update-btn btn btn-primary w-25">
                            Update
                        </button>


                        {/* signout button */}
                        <button onClick={signout} className="wd-signout-btn btn btn-danger w-25">
                            Sign out
                        </button>

                    </div>


                </div>
            )}
        </div>
    );
}