import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { logout } from "../../store/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import HobiLogo from "../../assets/images/hobi-logo.png";

const Navbar: React.FC = () => {
    const { user, loading } = useSelector((state: RootState) => state.auth); // Get user from Redux state
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

    if (loading) {
        return (
            <nav className="navbar bg-light">
                <div className="container">
                    <span>Loading...</span>
                </div>
            </nav>
        );
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <picture className="navbar-brand">
                    <div
                        style={{
                            height: "60px",
                            width: "60px",
                            overflow: "hidden",
                        }}
                    >
                        <img
                            src={HobiLogo}
                            alt="Logo"
                            style={{
                                height: "100%",
                                width: "100%",
                                objectFit: "cover", // Ensures the image fills the container
                                objectPosition: "center", // Centers the image
                            }}
                        />
                    </div>
                </picture>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div
                    className="collapse navbar-collapse justify-content-end"
                    id="navbarSupportedContent"
                >
                    <div className="d-flex align-items-center">
                        {user?.email ? (
                            <>
                                <span className="me-3">{user.email}</span>
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={handleLogout}
                                >
                                    Log out
                                </button>
                            </>
                        ) : (
                            <Link className="btn btn-primary" to="/login">
                                Log in
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
