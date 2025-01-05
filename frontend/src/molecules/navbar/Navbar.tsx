import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { logout } from "../../store/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth); // Get user from Redux state
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            dispatch(logout());
            navigate("/login");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">
                    HoBi
                </a>
                <div className="d-flex align-items-center">
                    {user?.email ? (
                        <>
                            <span className="me-3">{user.email}</span> {/* Display user email */}
                            <button className="btn btn-outline-danger" onClick={handleLogout}>
                                Log out
                            </button>
                        </>
                    ) : (
                        <a className="btn btn-primary" href="/login">
                            Log in
                        </a>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
