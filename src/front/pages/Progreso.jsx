import React from "react";
import styles from "../styles/Progreso.module.css";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";

export const Progreso = () => {

  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const navigate = useNavigate();

  const [chestPR, setChestPR] = useState(0)
  const [backPR, setBackPR] = useState(0)
  const [legsPR, setLegsPR] = useState(0)
  const [armsPR, setArmsPR] = useState(0)

  useEffect(() => {
    if (!token) {
      alert("Necesitas iniciar sesión para acceder a este campo");
      navigate("/login");
    }
    else {
      setChestPR(user.chest_pr)
      setBackPR(user.back_pr)
      setLegsPR(user.legs_pr)
      setArmsPR(user.arms_pr)
    }

  }, [token, navigate]);

  if (!token || !user) {
    return null;
  }





  return (
    <div className={`container ${styles.goalsRecordsContainer}`}>
      <div className="row">
        {/* Columna Izquierda - Metas */}
        <div className="col-md-5 me-5 mt-4">
          <div className={`card p-4 ${styles.neonCard}`}>
            <h3 className="text-center text-light mb-4">Metas</h3>
            <form>
              <div className="mb-3">
                <label className="form-label text-light">Calorías semanales</label>
                <input type="number" className={`form-control ${styles.neonInput}`} placeholder="Ej: 20,000" />
              </div>
              <div className="mb-3">
                <label className="form-label text-light">Proteínas semanales (g)</label>
                <input type="number" className={`form-control ${styles.neonInput}`} placeholder="Ej: 1,000" />
              </div>
              <div className="mb-3">
                <label className="form-label text-light">Entrenamientos</label>
                <input type="number" className={`form-control ${styles.neonInput}`} placeholder="Ej: 4" />
              </div>
              <button type="submit" className={`btn w-100 mt-3 ${styles.neonBtn}`}>Guardar</button>
            </form>
          </div>
        </div>

        {/* Columna Derecha - Records */}
        <div className="col-md-6 mt-4">
          <div className={`p-3 ${styles.neonCard}`}>
            <h2 className="text-center mb-4 text-white">Records</h2>
            <ul className="list-group list-group-flush">
              <li className={`list-group-item d-flex justify-content-between align-items-center bg-transparent text-light ${styles.neonList}`}>
                <span>Jalón al Pecho: <strong>{backPR} kg</strong></span>
                <button className={`btn btn-sm ${styles.neonBtn}`}>
                  <i className="fa-solid fa-pencil"></i>
                </button>
              </li>
              <li className={`list-group-item d-flex justify-content-between align-items-center bg-transparent text-light ${styles.neonList}`}>
                <span>Press de Banca: <strong>{chestPR} kg</strong></span>
                <button className={`btn btn-sm ${styles.neonBtn}`}>
                  <i className="fa-solid fa-pencil"></i>
                </button>
              </li>
              <li className={`list-group-item d-flex justify-content-between align-items-center bg-transparent text-light ${styles.neonList}`}>
                <span>Sentadilla: <strong>{legsPR} kg</strong></span>
                <button className={`btn btn-sm ${styles.neonBtn}`}>
                  <i className="fa-solid fa-pencil"></i>
                </button>
              </li>
              <li className={`list-group-item d-flex justify-content-between align-items-center bg-transparent text-light ${styles.neonList}`}>
                <span>Curl de Bíceps: <strong>{armsPR} kg</strong></span>
                <button className={`btn btn-sm ${styles.neonBtn}`}>
                  <i className="fa-solid fa-pencil"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
