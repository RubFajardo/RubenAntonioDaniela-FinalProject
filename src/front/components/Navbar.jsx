import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      const loggedUser = localStorage.getItem("user");
      setUser(loggedUser ? JSON.parse(loggedUser) : null);
    };

    checkUser()

    window.addEventListener("userChanged", checkUser);

    return () => {
      window.removeEventListener("userChanged", checkUser);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <div className="container">
        <Link className="navbar-brand" to="/">HOME</Link>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/#contacto">Contacto</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/#vision">Visión</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/habits">Hábitos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/agenda">Agenda</Link>
            </li>
          </ul>

          <div className="d-flex">
            {user ? (
              <span className="navbar-text">Bienvenido, {user.name} <button className="btn btn-outline-danger ms-3" onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.dispatchEvent(new Event("userChanged"));
                navigate("/login");
              }}>Cerrar sesión</button></span>
            ) : (
              <Link className="btn btn-outline-primary" to="/login">Iniciar sesión</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
