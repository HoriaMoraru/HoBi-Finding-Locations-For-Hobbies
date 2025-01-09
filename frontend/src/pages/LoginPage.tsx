import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../config/firebaseConfig.ts";
import LoginComponent from "../components/forms/LoginComponent";
import LoginImage from "../assets/images/login-page-real.jpg";
import LogoImage from "../assets/images/hobi-logo.png"; // Add your logo image path
import { useEffect, useState } from "react";
import { loginSuccess } from "../store/authSlice.ts";
import { RootState } from "../store";
import Spinner from "../atoms/spinners/Spinner.tsx";
import { Link } from "react-router-dom"; // Import Link

function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!loading && isAuthenticated) {
            navigate("/explore");
        }
    }, [loading, isAuthenticated, navigate]);

    if (loading) {
        return <Spinner />;
    }

    const handleFormSubmit = async (formData: { email: string; password: string }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            const idToken = await userCredential.user.getIdToken();
            localStorage.setItem("authToken", idToken);
            dispatch(loginSuccess({ email: userCredential.user.email || "" }));
            setError("");
            navigate("/explore");
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
            {/* Logo Section */}
            <Link to="/" style={{ position: "absolute", top: "10px", left: "10px", zIndex: 10 }}>
                <img
                    src={LogoImage}
                    alt="Logo"
                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                />
            </Link>

            {/* Login Section */}
            <div
                className="login-section d-flex flex-column justify-content-center align-items-center"
                style={{
                    flex: "1 1 33%",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    padding: "20px",
                }}
            >
                <div className="container d-flex flex-column align-items-center">
                    <h1 className="mb-3">Log in</h1>

                    {error && (
                        <div className="alert alert-danger w-100 text-center" role="alert">
                            {error}
                        </div>
                    )}

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
