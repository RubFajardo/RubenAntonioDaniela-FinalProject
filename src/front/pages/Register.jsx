import { useState } from "react"
import { useNavigate } from "react-router-dom";
import styles from "../styles/Register.module.css"

export const Register = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [question, setQuestion] = useState('Nombre de la primera mascota')
  const [questionAnswer, setQuestionAnswer] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)  

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);
    setError('')

    try {
      let new_user = {
        "name": name,
        "email": email,
        "password": password,
        "secret_question": question,
        "question_answer": questionAnswer,
        "profile_pic": "https://cdn-icons-png.flaticon.com/512/16/16480.png",
        "chest_pr": 0,
        "back_pr": 0,
        "legs_pr": 0,
        "arms_pr": 0
      }

      let response = await fetch(backendUrl + "api/register", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(new_user)
      });

      if (response.status === 400) {
        setError("Email ya registrado.");
        setIsSubmitting(false);
        return;
      }

      if (!response.ok) {
        setError("Error en el servidor, inténtalo de nuevo.");
        setIsSubmitting(false);
        return;
      }

      navigate("/login")
    } catch (err) {
      setError("Error de conexión. Inténtalo otra vez.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`${styles.registerContainer} container mt-5`}>
      <h2 className={styles.title}>Registro de Usuario</h2>
      {error ? <div className="text-danger h5 mt-2 mb-2">{error}</div> : null}
      <form onSubmit={handleSubmit} className="mt-4">

        <div className="mb-3">
          <label htmlFor="name" className={styles.label}>Nombre</label>
          <input
            type="text"
            id="name"
            className={styles.input}
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className={styles.label}>Correo Electrónico</label>
          <input
            type="email"
            id="email"
            className={styles.input}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className={styles.label}>Contraseña</label>
          <input
            type="password"
            id="password"
            className={styles.input}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="securityQuestion" className={styles.label}>Escoge una pregunta secreta</label>
          <select
            id="securityQuestion"
            className={styles.select}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          >
            <option value="Nombre de la primera mascota">Nombre de la primera mascota</option>
            <option value="Comida favorita">Comida favorita</option>
            <option value="Ciudad donde naciste">Ciudad donde naciste</option>
            <option value="Película favorita">Película favorita</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="questionAnswer" className={styles.label}>Respuesta:</label>
          <input
            type="text"
            id="questionAnswer"
            className={styles.input}
            onChange={(e) => setQuestionAnswer(e.target.value)}
            value={questionAnswer}
            required
          />
        </div>

        <button 
          type="submit" 
          className={styles.registerButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
};
