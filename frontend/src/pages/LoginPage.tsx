import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import LoginComponent from "../components/forms/LoginComponent";
import { useState } from "react";

function LoginPage() {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleFormSubmit = async (formData: { email: string; password: string }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            console.log("User signed in:", userCredential.user);
            const idToken = await userCredential.user.getIdToken();
            localStorage.setItem("authToken", idToken);

            setError(""); // Clear any previous errors
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
        <div className="container d-flex flex-column align-items-center mt-3">
            <h1 className="mb-3">Log in</h1>

            {/* Bootstrap Banner for Errors */}
            {error ? (
                <div className="alert alert-danger w-100 text-center" role="alert">
                    {error}
                </div>
            ) : null}

            <div className="w-100" style={{ maxWidth: "400px" }}>
                <LoginComponent onSubmit={handleFormSubmit} />
            </div>
        </div>
    );
}

export default LoginPage;
