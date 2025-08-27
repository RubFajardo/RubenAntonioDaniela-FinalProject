import React from "react";
import styles from "../styles/Progreso.module.css";
import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

export const Progreso = () => {

  const token = localStorage.getItem("token")
  const user = JSON.parse(localStorage.getItem("user"))
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const navigate = useNavigate();

  const [chestPR, setChestPR] = useState(0)
  const [backPR, setBackPR] = useState(0)
  const [legsPR, setLegsPR] = useState(0)
  const [armsPR, setArmsPR] = useState(0)
  const [modalOpen, setModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState("")
  const [newValue, setNewValue] = useState(0)
  const [message, setMessage] = useState("")

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

  }, [token, navigate, user]);

  if (!token || !user) {
    return null;
  }

  const editPRHandler = (pr, value) => {
    setMessage("")
    setCurrentRecord(pr);
    setNewValue(value);
    setModalOpen(true);
  };

  const saveRecord = async () => {

    const promise = await fetch(backendUrl + `api/editPR/${currentRecord}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ [currentRecord]: newValue })
    });

    if (!promise.ok) {
      const errorData = await promise.json();
      alert(errorData.message || "Error al actualizar el PR, intenta más tarde.");
      return;
    }

    if (newValue > user[currentRecord]) {
      setMessage("¡Felicidades! 🥳🥳 Has logrado un nuevo PR 💪💪 ¡Sigue así! 🥳");
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      const audio = new Audio("/confetti.mp3");
      audio.play();
    }

    const updatedUser = { ...user, [currentRecord]: newValue };
    localStorage.setItem("user", JSON.stringify(updatedUser));


    setModalOpen(false);
};



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
            <h2 className="text-center mb-4 text-white">Records Personales</h2>
            <ul className="list-group list-group-flush">
              <li className={`list-group-item d-flex justify-content-between align-items-center bg-transparent text-light ${styles.neonList}`}>
                <span>Jalón al Pecho: <strong>{backPR} kg</strong></span>
                <button onClick={() => editPRHandler("back_pr", backPR)} className={`btn btn-sm ${styles.neonBtn}`}>
                  <i className="fa-solid fa-pencil"></i>
                </button>
              </li>
              <li className={`list-group-item d-flex justify-content-between align-items-center bg-transparent text-light ${styles.neonList}`}>
                <span>Press de Banca: <strong>{chestPR} kg</strong></span>
                <button onClick={() => editPRHandler("chest_pr", chestPR)} className={`btn btn-sm ${styles.neonBtn}`}>
                  <i className="fa-solid fa-pencil"></i>
                </button>
              </li>
              <li className={`list-group-item d-flex justify-content-between align-items-center bg-transparent text-light ${styles.neonList}`}>
                <span>Sentadilla: <strong>{legsPR} kg</strong></span>
                <button onClick={() => editPRHandler("legs_pr", legsPR)} className={`btn btn-sm ${styles.neonBtn}`}>
                  <i className="fa-solid fa-pencil"></i>
                </button>
              </li>
              <li className={`list-group-item d-flex justify-content-between align-items-center bg-transparent text-light ${styles.neonList}`}>
                <span>Curl de Bíceps: <strong>{armsPR} kg</strong></span>
                <button onClick={() => editPRHandler("arms_pr", armsPR)} className={`btn btn-sm ${styles.neonBtn}`}>
                  <i className="fa-solid fa-pencil"></i>
                </button>
              </li>
            </ul>
            {message ? <div className="text-success h5 mt-4 mb-2">{message}</div> : null}
          </div>
          
          {modalOpen && (
            <div className="modal fade show d-block" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className={`modal-content ${styles.neonCard}`}>
                  <div className="modal-header">
                    <h5 className="modal-title">¿Tienes un nuevo PR? 🤩💪💪🎉🎉</h5>
                    <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
                  </div>
                  <div className="modal-body">
                    <label className="form-label">Mi nuevo PR (kg):</label>
                    <input
                      type="number"
                      className={`form-control ${styles.neonInput}`}
                      value={newValue}
                      onChange={(e) => setNewValue(parseInt(e.target.value))}
                    />
                  </div>
                  <div className="modal-footer">
                    <button className={`btn ${styles.neonBtn}`} onClick={saveRecord}>
                      Guardar
                    </button>
                    <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
