import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.css";

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
    <nav className={`navbar navbar-expand-lg px-4 ${styles.nav}`}>
      <div className="container pt-2 pb-4">
        <Link className={styles.navbarBrand} to="/">HOME</Link>
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${styles.navLink}`} to="/#contacto">Contacto</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${styles.navLink}`} to="/#vision">Visión</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${styles.navLink}`} to="/habits">Hábitos</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${styles.navLink}`} to="/perfil">Mi Perfil</Link>
            </li>
          </ul>

          {/* Usuario */}

          <div className={styles.user}>
            {user ? (
              <span>Bienvenido, {user.name} <button className={`btn ${styles.logInOut}`} onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.dispatchEvent(new Event("userChanged"));
                navigate("/login");
              }}>Cerrar sesión</button></span>
            ) : (
              <Link className={`btn ${styles.logInOut}`} to="/login">Iniciar sesión</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
