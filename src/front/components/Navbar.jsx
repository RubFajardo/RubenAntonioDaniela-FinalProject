import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import { Modal } from "bootstrap";
import Logo from "../assets/img/Logo.png"

export const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkUser = () => {
      const loggedUser = localStorage.getItem("user");
      setUser(loggedUser ? JSON.parse(loggedUser) : null);
    };

    checkUser();
    window.addEventListener("userChanged", checkUser);

    return () => {
      window.removeEventListener("userChanged", checkUser);
    };
  }, []);

  const handleRestrictedClick = (e, path) => {
    e.preventDefault();
    if (!token) {
      const modalEl = document.getElementById("loginRequiredModal");
      const modal = new Modal(modalEl);
      modal.show();
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <nav className={`navbar navbar-expand-lg px-4 ${styles.nav}`}>
        <div className="container pt-2 pb-4">
          <Link className={styles.navbarBrand} to="/">
            <img src={Logo} alt="Logo" className={styles.logo} />
          </Link>
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className={`nav-link ${styles.navLink}`} to="/#contacto">Contacto</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${styles.navLink}`} to="/#vision">Visión</Link>
              </li>
              <li className="nav-item">
                <a
                  href="/habits"
                  className={`nav-link ${styles.navLink}`}
                  onClick={(e) => handleRestrictedClick(e, "/habits")}
                >
                  Hábitos
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="/perfil"
                  className={`nav-link ${styles.navLink}`}
                  onClick={(e) => handleRestrictedClick(e, "/perfil")}
                >
                  Mi Perfil
                </a>
              </li>
            </ul>

            <div className={styles.user}>
              {user ? (
                <span>
                  Bienvenido, {user.name}{" "}
                  <button
                    className={`btn ${styles.logInOut}`}
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      window.dispatchEvent(new Event("userChanged"));
                      navigate("/login");
                    }}
                  >
                    Cerrar sesión
                  </button>
                </span>
              ) : (
                <Link className={`btn ${styles.logInOut}`} to="/login">
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="modal fade" id="loginRequiredModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Acceso restringido</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div className="modal-body">
              Debes iniciar sesión antes de continuar.
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/login")}
                data-bs-dismiss="modal"
              >
                Ir al login
              </button>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
