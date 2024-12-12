import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "../styles/Login.module.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false); // New state for password visibility
    const router = useRouter();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");

        try {
            const response = await axios.post(`${apiBaseUrl}/api/auth/login`, {
                email,
                password,
            });

            if (response.status === 200) {
                const token = response.data.data.access_token;
                const expiresIn = 24 * 60 * 60;

                const expiryTime = new Date().getTime() + expiresIn * 1000;

                localStorage.setItem("authToken", token);
                localStorage.setItem("expiryTime", expiryTime.toString());
                localStorage.setItem("hasAttemptedLogin", "true");

                router.push("/register");
            }
        } catch (error) {
            if (error.response) {
                // Handle response errors from the server
                const errorMessage = error.response.data.message || error.response.data.error;

                if (errorMessage.includes("Invalid email")) {
                    setError("The email address you entered is not registered.");
                } else if (errorMessage.includes("Invalid password")) {
                    setError("The password you entered is incorrect.");
                } else {
                    setError(errorMessage || "Login failed. Please check your credentials.");
                }
                
                console.error("Login failed:", error.response.data);
            } else if (error.request) {
                // Handle no response from server
                console.error("No response received from server:", error.request);
                setError("Server did not respond. Please try again later.");
            } else {
                // Handle any other errors
                console.error("Error:", error.message);
                setError("An unexpected error occurred.");
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <img src="/pln-icon.png" alt="Logo" className={styles.logo} />
                <h2 className={styles.title}>Buat Identitas Digital Anda</h2>
                <p className={styles.minititle}>Mulai dengan kami mengenal Anda</p>

                

                <form className={styles.form} onSubmit={handleLogin}>
                    <div className={styles.inputContainer}>
                        <i className={`fa-solid fa-envelope ${styles.inputIcon}`} aria-hidden="true"></i>
                        <div className={styles.separator}></div>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.inputContainer}>
                        <i className={`fa-solid fa-lock ${styles.inputIcon}`} aria-hidden="true"></i>
                        <div className={styles.separator}></div>

                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <span className={styles.togglePassword} onClick={togglePasswordVisibility}>
                            <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </span>
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <button type="submit" className={styles.button}>Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
