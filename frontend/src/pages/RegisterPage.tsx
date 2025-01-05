import { useNavigate } from "react-router-dom";
import RegisterComponent from '../components/forms/RegisterComponent';

function RegisterPage() {
    const navigate = useNavigate();

    const handleFormSubmit = async (formData: { email: string; password: string; confirmPassword: string }) => {
        try {
            // Make a POST request to the backend
            const response = await fetch('http://localhost:8080/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to register. Status: ${response.status}`);
            }

            // Navigate to the home page after successful registration
            navigate("/", { state: { formData, dataSubmitted: true } });
        } catch (error) {
            console.error('Error during registration:', error);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <div className="container d-flex flex-column align-items-center mt-3">
            <h1 className="mb-3">Register</h1>
            <div className="w-100" style={{ maxWidth: "400px" }}>
                <RegisterComponent onSubmit={handleFormSubmit} />
            </div>
        </div>
    );
}

export default RegisterPage;
