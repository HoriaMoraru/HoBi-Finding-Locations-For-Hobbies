import { useState, useRef, useEffect } from "react";
import * as Yup from "yup";
import { ValidationError } from "yup";

function RegisterComponent({
                               onSubmit,
                           }: {
    onSubmit: (data: { email: string; password: string; confirmPassword: string }) => void;
}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});

    const emailInputRef = useRef<HTMLInputElement | null>(null);

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .matches(/@/, "Email doesn't match the right format.")
            .required("Email is required."),
        password: Yup.string()
            .length(6, "Password must be at least 6 characters long.")
            .required("Password is required."),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match.")
            .required("Password is required."),
    });

    useEffect(() => {
        if (emailInputRef.current) {
            emailInputRef.current.focus();
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = {
            email,
            password,
            confirmPassword,
        };

        try {
            await validationSchema.validate(formData, { abortEarly: false });
            setErrors({});
            onSubmit(formData);
            resetForm();
        } catch (err) {
            if (err instanceof ValidationError) {
                const newErrors = err.inner.reduce(
                    (acc: { [key: string]: string }, error) => ({
                        ...acc,
                        [error.path as string]: error.message,
                    }),
                    {}
                );
                setErrors(newErrors);
            }
        }
    };

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setErrors({});
        emailInputRef.current?.focus(); // Refocus the first input field
    };

    const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>, fieldName: string) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setter(e.target.value);
            setErrors((prevErrors) => ({
                ...prevErrors,
                [fieldName]: "",
            }));
        };

    return (
        <form onSubmit={handleSubmit} className="container mt-4">
            <div className="mb-3">
                <label className="form-label">Email:</label>
                <input
                    type="text"
                    value={email}
                    onChange={handleChange(setEmail, "email")}
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    ref={emailInputRef} // Attach the ref for initial focus
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="mb-3">
                <label className="form-label">Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={handleChange(setPassword, "password")}
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
            </div>

            <div className="mb-3">
                <label className="form-label">Confirm Password:</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={handleChange(setConfirmPassword, "confirmPassword")}
                    className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                />
                {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
            </div>

            <div className="d-flex justify-content-center gap-2">
                <button type="submit" className="btn btn-primary">
                    Sign up
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Clear
                </button>
            </div>
        </form>
    );
}

export default RegisterComponent;
