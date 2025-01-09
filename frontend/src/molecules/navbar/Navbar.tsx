import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { logout } from "../../store/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import HobiLogo from "../../assets/images/hobi-logo.png";
import { Avatar, Menu, MenuItem, IconButton, Tooltip } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout"; // Material-UI Logout Icon

const Navbar: React.FC = () => {
    const { user, loading } = useSelector((state: RootState) => state.auth); // Get user from Redux state
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            dispatch(logout());
            navigate("/");
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
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
                <Link className="navbar-brand" to="/">
                    <div
                        style={{
                            height: "60px",
                            width: "60px",
                            overflow: "hidden",
                            marginLeft: "-8px",
                        }}
                    >
                        <img
                            src={HobiLogo}
                            alt="Logo"
                            style={{
                                height: "100%",
                                width: "100%",
                                objectFit: "cover",
                                objectPosition: "center",
                            }}
                        />
                    </div>
                </Link>
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
                            <div className="d-flex align-items-center">
                                {/* User Avatar Button */}
                                <Tooltip title="Account settings">
                                    <IconButton onClick={handleMenuOpen}>
                                        <Avatar alt={user.email} src="/broken-image.jpg" />
                                    </IconButton>
                                </Tooltip>

                                {/* Dropdown Menu */}
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "right",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                >
                                    <MenuItem disabled>{user.email}</MenuItem>
                                </Menu>

                                {/* Logout Icon Button */}
                                <Tooltip title="Log out">
                                <IconButton
                                    onClick={handleLogout}
                                    className="ms-3"
                                    color="error"
                                    style={{
                                        fontSize: "1.5rem", // Adjust size here
                                    }}
                                >
                                    <LogoutIcon style={{ fontSize: "2rem" }} /> {/* Adjust icon size */}
                                </IconButton>
                            </Tooltip>
                            </div>
                            ) :
                            (
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
