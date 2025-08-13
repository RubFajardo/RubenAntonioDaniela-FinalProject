import React, { useState } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/Login.module.css"

export const Login = () => {

        const [email, setEmail] = useState('')
        const [password, setPassword] = useState('')
		const backendUrl = import.meta.env.VITE_BACKEND_URL
    
        const navigate = useNavigate();

        const handleSubmit = async (e) => {
            e.preventDefault();
            let user_credentials = {
                "email": email,
                "password": password
            }
            let resp = await fetch(backendUrl + "api/login", {
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify(user_credentials)
            }) 
			const data = await resp.json()

			if (!resp.ok){
				alert(data.error || "Contraseña incorrecta");
				return;
			}
			
			localStorage.setItem("token", data.token);
			localStorage.setItem("user", JSON.stringify(data.user));
			window.dispatchEvent(new Event("userChanged"));

            navigate("/")
        };
    
		
    return (
		<div className={`container mt-5 ${styles.login}`}>
			<h2>Iniciar Sesión</h2>
			<form onSubmit={handleSubmit} className="mt-4">
				<div className="mb-3">
					<label htmlFor="email" className={`form-label ${styles.label}`}>Correo Electrónico</label>
					<input
						type="email"
						className={`form-control ${styles.input}`}
						id="email"
						onChange={(e) => setEmail(e.target.value)}
						value={email}
						required
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="password" className={`form-label ${styles.label}`}>Contraseña</label>
					<input
						type="password"
						className={`form-control ${styles.input}`}
						onChange={(e) => setPassword(e.target.value)}
						id="password"
						value={password}
						required
					/>
				</div>
				<button type="submit" className={`btn ${styles.logInButton}`}>Iniciar Sesion</button>
				<p className="mt-3 d-flex h6">¿Eres nuevo?<Link to="/register" className={`ms-2 text-decoration-underline ${styles.register}`}>¡Regístrate!</Link></p>
				<Link to="/recovery" className={`text-decoration-underline mt-3 d-flex h6 ${styles.forgottenPassword}`}>¿Olvidaste tu contraseña?</Link>
			</form>
		</div>
	);
}; 