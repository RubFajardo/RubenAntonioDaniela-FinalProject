import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
		<div className="container">
      <Link className="navbar-brand" to="/">HOME</Link>

      <div className="collapse navbar-collapse" id="navbarContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link" to="/contacto">Contacto</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/vision">Visión</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/habitos">Hábitos</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/agenda">Agenda</Link>
          </li>
        </ul>

        <div className="d-flex">
          <Link className="btn btn-outline-primary" to="/login">
            Iniciar sesión
          </Link>
        </div>
      </div>
	  </div>
    </nav>
  );
};
