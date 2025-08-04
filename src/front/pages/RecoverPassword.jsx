import React, { useState } from 'react';
import { Link } from "react-router-dom";

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
        <div className="container d-flex justify-content-center align-items-center">
            <div className="card p-4 mt-5 mb-5">

                {step === 1 ? (
                    <div>
                        <h5 className="card-title mb-3">Recuperar contraseña</h5>
                        <p className="card-text">Por favor, introduce tu correo electrónico.</p>
                        <form onSubmit={handleEmailSubmit}>
                            <div className="mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Correo electrónico"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            {error ? <div className="text-danger mb-2">{error}</div> : null}
                            <button type="submit" className="btn btn-primary w-100">
                                Buscar cuenta
                            </button>
                        </form>
                    </div>
                ) : null}

                {step === 2 ? (
                    <div>
                        <h5 className="card-title mb-3 text-center">Pregunta de seguridad</h5>
                        <h4 className="card-text mt-4 mb-3 text-center">{question}</h4>
                        <form onSubmit={handleAnswerSubmit}>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tu respuesta"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    required
                                />
                            </div>
                            {error ? <div className="text-danger mb-2">{error} </div> : null}
                            <button type="submit" className="btn btn-success w-100">
                                Verificar respuesta
                            </button>
                        </form>
                    </div>
                ) : null}

                {step === 3 ? (
                    <div>
                        <h5 className="card-title mb-3">Restablecer contraseña</h5>
                        <form onSubmit={handlePasswordReset}>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Nueva contraseña"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Confirmar nueva contraseña"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error ? <div className="text-danger mb-2">{error}</div> : null}
                            <button type="submit" className="btn btn-warning w-100">
                                Cambiar contraseña
                            </button>
                        </form>
                    </div>
                ) : null}

                {step === 4 ? (
                    <div>
                        <h5 className="card-title mb-3">Éxito</h5>
                        <p className="text-success">{successMsg}</p>
                        <Link className="btn btn-primary w-100" to="/login">Ir al Inicio de sesión</Link>
                    </div>
                ) : null}
            </div>
        </div>
    );
};
