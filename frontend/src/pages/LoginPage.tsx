import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { auth } from "../config/firebaseConfig.ts";
import LoginComponent from "../components/forms/LoginComponent";
import LoginImage from "../assets/images/login-page.jpg";
import { useState } from "react";
import {loginSuccess} from "../store/authSlice.ts";

function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState("");

    const handleFormSubmit = async (formData: { email: string; password: string }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            console.log("User signed in:", userCredential.user);
            const idToken = await userCredential.user.getIdToken();
            localStorage.setItem("authToken", idToken);
            const user = userCredential.user;
            dispatch(loginSuccess({ email: user.email || "" }));
            setError("");
            navigate("/");
        } catch (err: unknown) {
            if (err instanceof Error && "code" in err) {
                const errorCode = (err as { code: string }).code;

                switch (errorCode) {
                    case "auth/invalid-email":
                        setError("Invalid email format. Please check your email.");
                        break;
                    case "auth/user-not-found":
                        setError("No user found with this email. Please sign up.");
                        break;
                    case "auth/wrong-password":
                        setError("Incorrect password. Please try again.");
                        break;
                    case "auth/network-request-failed":
                        setError("Network error. Please check your internet connection.");
                        break;
                    default:
                        setError("Failed to sign in. Please try again later.");
                        break;
                }
            } else {
                console.error("Unexpected error:", err);
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <div
            className="d-flex vh-100"
            style={{
                color: "white",
                overflow: "hidden",
            }}
        >
            {/* Login Section */}
            <div
                className="login-section d-flex flex-column justify-content-center align-items-center"
                style={{
                    flex: "1 1 33%",
                    backgroundColor: "rgba(0, 0, 0, 0.8)", // Semi-transparent dark background
                    padding: "20px",
                }}
            >
                <div className="container d-flex flex-column align-items-center">
                    <h1 className="mb-3">Log in</h1>

                    {error ? (
                        <div className="alert alert-danger w-100 text-center" role="alert">
                            {error}
                        </div>
                    ) : null}

                    <div className="w-100" style={{ maxWidth: "400px" }}>
                        <LoginComponent onSubmit={handleFormSubmit} />
                    </div>
                    <div
                        className="w-100 d-flex flex-column align-items-center mt-3"
                        style={{ maxWidth: "400px" }}
                    >
                        <a
                            href="/register"
                            className="text-decoration-none fw-bold"
                            style={{ color: "white", textDecoration: "underline" }}
                        >
                            Do you not have an account? Register now
                        </a>
                    </div>
                </div>
            </div>

            {/* Image Section */}
            <div
                className="image-section"
                style={{
                    flex: "2 1 67%",
                    backgroundImage: `url(${LoginImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            ></div>
        </div>
    );
}

export default LoginPage;
