import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom";

export const Agenda = () => {
const token = localStorage.getItem("token")

if (!token) {
    return alert ("necesitas iniciar sesión para acceder a este campo")
}
const user = JSON.parse(localStorage.getItem("user"))

return (
 <>
  <div className="container mt-5">
    <div className="card mx-auto shadow" style={{ maxWidth: '500px' }}>
      <div className="card-body text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/16/16480.png"
          alt="Profile"
          className="rounded-circle mb-3"
          width="150"
          height="150"
        />
        <h3 className="card-title">{user.name}</h3>
        <p className="card-text text-muted">{user.email}</p>

        {/* Botón Editar Perfil */}
        <button
          onClick={() => alert("Función de editar perfil aquí")}
          className="btn btn-outline-dark btn-sm mt-3"
          style={{ borderRadius: '20px', padding: '6px 20px', fontWeight: '500' }}
          aria-label="Editar Perfil"
        >
          Editar Perfil
        </button>
      </div>
    </div>
  </div>

  <div className="container py-5">
    <h2 className="mb-4 text-center">Selecciona una fecha</h2>
    <div className="row justify-content-center">
      <div className="col-md-4">
        <input
          id="datepicker"
          className="form-control form-control-lg text-center"
          placeholder="Haz clic para elegir fecha"
        />
      </div>
    </div>
  </div>
</>
)
}
