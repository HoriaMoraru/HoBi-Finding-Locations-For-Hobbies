import { useNavigate } from "react-router-dom";
import RegisterComponent from "../components/forms/RegisterComponent";
import RegisterImage from "../assets/images/register-page.jpg";

function RegisterPage() {
    const navigate = useNavigate();

    const handleFormSubmit = async (formData: { email: string; password: string }) => {
        try {
            // Make a POST request to the backend
            const response = await fetch("http://localhost:8080/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to register. Status: ${response.status}`);
            }

            // Navigate to the login page after successful registration
            navigate("/login", { state: { formData, dataSubmitted: true } });
        } catch (error) {
            console.error("Error during registration:", error);
            alert("Registration failed. Please try again.");
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
            {/* Register Section */}
            <div
                className="register-section d-flex flex-column justify-content-center align-items-center"
                style={{
                    flex: "1 1 33%",
                    backgroundColor: "rgba(0, 0, 0, 0.8)", // Semi-transparent dark background
                    padding: "20px",
                }}
            >
                <div className="container d-flex flex-column align-items-center">
                    <h1 className="mb-3">Register</h1>
                    <div className="w-100" style={{maxWidth: "400px"}}>
                        <RegisterComponent onSubmit={handleFormSubmit}/>
                    </div>
                    <div
                        className="w-100 d-flex flex-column align-items-center mt-3"
                        style={{maxWidth: "400px"}}
                    >
                        <a
                            href="/login"
                            className="text-decoration-none fw-bold"
                            style={{color: "white", textDecoration: "underline"}}
                        >
                            Already have an account? Login now
                        </a>
                    </div>
                </div>
            </div>

            {/* Image Section */}
            <div
                className="image-section"
                style={{
                    flex: "2 1 67%",
                    backgroundImage: `url(${RegisterImage})`, // Correctly referencing the imported image
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            ></div>
        </div>
    );
}

export default RegisterPage;
