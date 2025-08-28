import React, { useState, useEffect } from "react";
import styles from "../styles/Progreso.module.css";
import { useNavigate, Link } from "react-router-dom";
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
  const [calorias, setCalorias] = useState("")
  const [proteinas, setProteinas] = useState("")
  const [entrenamientos, setEntrenamientos] = useState("")
  const [goalId, setGoalId] = useState(null)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingGoals, setPendingGoals] = useState({ calorias: 0, proteinas: 0, entrenamientos: 0 });
  const [progress, setProgress] = useState({calorias: 0, proteinas: 0, entrenamientos: 0})


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

  const saveGoals = async (e) => {
    e.preventDefault();

    if (goalId) {
      setPendingGoals({ calorias, proteinas, entrenamientos });
      setConfirmModalOpen(true);
      return;
    }

    await saveOrUpdateGoals({ calorias, proteinas, entrenamientos }, goalId);
  };

  const saveOrUpdateGoals = async (goals, id = null) => {
    try {
      const url = id ? backendUrl + "api/goals/" + id : backendUrl + "api/goals";
      const method = id ? "PUT" : "POST";

      const resp = await fetch(url, {
        method,
        headers: {
          "content-type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({
          calorias: parseInt(goals.calorias) || 0,
          proteinas: parseInt(goals.proteinas) || 0,
          entrenamientos: parseInt(goals.entrenamientos) || 0
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        alert(data.message || "Error al guardar las metas");
        return null;
      }

      setGoalId(data.id || id);
      return {
        calorias: data.calorias || calorias,
        proteinas: data.proteinas || proteinas,
        entrenamientos: entrenamientos || entrenamientos,
    }

    } catch (error) {
    console.log("Error al guardar las metas:", error);
    return null;
  }
};

const getGoals = async () => {

  try {
    const resp = await fetch(backendUrl + "api/goals", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    if (resp.ok) {
      const data = await resp.json()
      if (data.goals && data.goals.length > 0) {
        const goal = data.goals[0];
        setCalorias(goal.calorias);
        setProteinas(goal.proteinas);
        setEntrenamientos(goal.entrenamientos)
        setGoalId(goal.id)
      }
    }
  } catch (error) {
    console.log("Error al traer las metas", error)
  }
}

useEffect(() => {
  getGoals()
}, []);

const weeklyProgress = async () => {
  const startOfWeek = dayjs().startOf("week").format("YYYY-MM-DD");
  const endOfWeek = dayjs().endOF("week").format("YYYY-MM-DD");

  try {
    const resp = await fetch(backendUrl + "api/daily_habits/" + startOfWeek + "/" + endOfWeek, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    if (!resp.ok) throw new Error("Error al traer los habitos semanales");
    const data = await resp.json();

    let calorias = 0;
    let proteinas = 0;
    let entrenamientos = 0;

    data.forEach(record => {
      if (record.habits){
        calorias += record.habits.calorias || 0;
        proteinas += record.habits.proteinas || 0;
        if (record.habits.entrenamientos) entrenamientos += 1;
      }
    });

    setProgress({calorias, proteinas, entrenamientos})
  } catch (error) {
    console.log(error)
  }
};

useEffect(() => {
  weeklyProgress()
}, [])

return (
  <div className="container">
    <div className="row d-flex align-items-stretch">

      {/* Columna Izquierda - Metas */}

      <div className="col-md-5 mt-4 mx-auto" key={goalId}>
        <div className={`card p-4 h-100 ${styles.neonCard}`}>
          <h3 className="text-center text-light mb-3">Establece tus metas semanales</h3>

          <div className="row mb-2">
            <div className="col-4"></div>
            <div className="col-4 text-center">
              <h6 className="text-light mb-1">Tus metas actuales</h6>
            </div>
            <div className="col-4 text-center">
              <h6 className="text-light mb-1">Tu progreso actual</h6>
            </div>
          </div>

          <form onSubmit={saveGoals}>

            {/* Fila Calorías */}

            <div className="row mb-2 align-items-center">
              <div className="col-4 text-light text-start d-flex justify-content-start align-items-center">
                Calorías:
              </div>
              <div className="col-4">
                <input
                  type="number"
                  className={`form-control form-control-sm ${styles.neonInput}`}
                  placeholder="Ej: 20000"
                  value={calorias}
                  onChange={(e) => setCalorias(e.target.value)} />
              </div>
              <div className="col-4">
                <input
                  type="number"
                  className={`form-control form-control-sm ${styles.neonInput}`}
                  value={progress.calorias}
                  readOnly />
              </div>
            </div>

            {/* Fila Proteínas */}

            <div className="row mb-2 align-items-center">
              <div className="col-4 text-light text-start d-flex justify-content-start align-items-center">
                Proteínas (g):
              </div>
              <div className="col-4">
                <input
                  type="number"
                  className={`form-control form-control-sm ${styles.neonInput}`}
                  placeholder="Ej: 500"
                  value={proteinas}
                  onChange={(e) => setProteinas(e.target.value)} />
              </div>
              <div className="col-4">
                <input
                  type="number"
                  className={`form-control form-control-sm ${styles.neonInput}`}
                  value={progress.proteinas}
                  readOnly />
              </div>
            </div>

            {/* Fila Entrenamientos */}

            <div className="row mb-2 align-items-center">
              <div className="col-4 text-light text-start d-flex justify-content-start align-items-center">
                Entrenamientos:
              </div>
              <div className="col-4">
                <input
                  type="number"
                  className={`form-control form-control-sm ${styles.neonInput}`}
                  placeholder="Ej: 4"
                  value={entrenamientos}
                  onChange={(e) => setEntrenamientos(e.target.value)} />
              </div>
              <div className="col-4">
                <input
                  type="number"
                  className={`form-control form-control-sm ${styles.neonInput}`}
                  value={progress.entrenamientos}
                  readOnly />
              </div>
            </div>
            <div className="col-4 d-block mx-auto mt-3">
              <button type="submit" className={`btn btn-sm btn-primary w-100 ${styles.neonBtn}`}>
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Columna Derecha - Records */}

      <div className="col-md-6 mt-4 mx-auto">
        <div className={`p-3 h-100 ${styles.neonCard}`}>
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

      {/* Modal de confirmación de sobrescribir metas */}

      {confirmModalOpen && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content ${styles.neonCard}`}>
              <div className="modal-header">
                <h5 className="modal-title">Ya existe una meta para esta semana</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setConfirmModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>¿Deseas sobrescribirla con los nuevos valores?</p>
              </div>
              <div className="modal-footer">
                <button
                  className={`btn ${styles.neonBtn}`}
                  onClick={async () => {
                    const savedGoals = await saveOrUpdateGoals(pendingGoals, goalId);
                    if (savedGoals) {
                      setCalorias(savedGoals.calorias);
                      setProteinas(savedGoals.proteinas);
                      setEntrenamientos(savedGoals.entrenamientos);
                    }
                    setConfirmModalOpen(false);
                  }}
                >
                  Sí
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setConfirmModalOpen(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)
}
