import React, { useState } from 'react';
import { Link } from "react-router-dom";
import styles from "../styles/PasswordRecovery.module.css"

export const PasswordRecovery = () => {

    const [step, setStep] = useState(1)
    const [email, setEmail] = useState('')
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(backendUrl + "api/recover/email", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({ "email": email })
            });

            const data = await response.json();

            if (response.ok) {
                setQuestion(data.user.secret_question);
                setStep(2);
            } else if (response.status === 404) {
                setError("Email no encontrado");
            } else {
                setError(data?.error || "Error desconocido.");
            }
        } catch (err) {
            console.error("Error:", err);
            setError("Hubo un problema con la solicitud.");
        }
    };

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const verification = {
            "email": email,
            "question_answer": answer
        }
        const promise = await fetch(backendUrl + "api/recover/verify", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(verification)
        })

        if (promise.ok) {
            setStep(3)
        }
        else {
            setError("Respuesta incorrecta. Inténtalo de nuevo.")
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        const newCredentials = {
            "email": email,
            "new_password": newPassword,
        }
        const promise = await fetch(backendUrl + "api/recover/reset-password", {
            method: "PUT",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(newCredentials)
        })

        if (promise.ok) {
            setSuccessMsg('¡Contraseña cambiada exitosamente! Ahora puedes iniciar sesión.');
            setStep(4)
        }
        else {
            setError("No se pudo cambiar la contraseña")
        }
    };

    return (
        <div className={styles.recoverContainer}>
            <div className={styles.recoverCard}>

                {step === 1 && (
                    <div>
                        <h5 className={styles.title}>Recuperar contraseña</h5>
                        <p className={styles.subtitle}>Por favor, introduce tu correo electrónico.</p>
                        <form onSubmit={handleEmailSubmit}>
                            <input
                                type="email"
                                className={styles.input}
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {error && <div className={styles.error}>{error}</div>}
                            <button type="submit" className={styles.buttonPrimary}>
                                Buscar cuenta
                            </button>
                        </form>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h5 className={styles.title}>Pregunta de seguridad</h5>
                        <h4 className={styles.subtitle}>{question}</h4>
                        <form onSubmit={handleAnswerSubmit}>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Tu respuesta"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                required
                            />
                            {error && <div className={styles.error}>{error}</div>}
                            <button type="submit" className={styles.buttonSuccess}>
                                Verificar respuesta
                            </button>
                        </form>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h5 className={styles.title}>Restablecer contraseña</h5>
                        <form onSubmit={handlePasswordReset}>
                            <input
                                type="password"
                                className={styles.input}
                                placeholder="Nueva contraseña"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                className={styles.input}
                                placeholder="Confirmar nueva contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            {error && <div className={styles.error}>{error}</div>}
                            <button type="submit" className={styles.buttonWarning}>
                                Cambiar contraseña
                            </button>
                        </form>
                    </div>
                )}

                {step === 4 && (
                    <div>
                        <h5 className={styles.title}>Éxito</h5>
                        <p className={styles.success}>{successMsg}</p>
                        <Link className={styles.buttonPrimary} to="/login">
                            Ir al Inicio de sesión
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};
