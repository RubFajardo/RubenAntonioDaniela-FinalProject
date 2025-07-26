import { useState } from "react"
import { useNavigate } from "react-router-dom";

export const Register = () => {

	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		let new_user = {
			"name": name,
			"email": email,
			"password": password
		}
		let promise = await fetch("https://verbose-space-journey-r46j4jq9976x2xww-3001.app.github.dev/api/register", {
			method: "POST",
			headers: {"Content-type": "application/json"},
			body: JSON.stringify(new_user)
		});
		navigate("/login")
	};

	return (
		<div className="container mt-5">
			<h2>Registro de Usuario</h2>
			<form onSubmit={handleSubmit} className="mt-4">
				<div className="mb-3">
					<label htmlFor="name" className="form-label">Nombre</label>
					<input
						type="name"
						className="form-control"
						id="name"
						onChange={(e) => setName(e.target.value)}
						value={name}
						required
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="email" className="form-label">Correo Electrónico</label>
					<input
						type="email"
						className="form-control"
						id="email"
						onChange={(e) => setEmail(e.target.value)}
						value={email}
						required
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="password" className="form-label">Contraseña</label>
					<input
						type="password"
						className="form-control"
						onChange={(e) => setPassword(e.target.value)}
						id="password"
						value={password}
						required
					/>
				</div>
				<button type="submit" className="btn btn-primary">Registrarse</button>
			</form>
		</div>
	);
}; 