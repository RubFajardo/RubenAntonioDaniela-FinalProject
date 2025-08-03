import React, { useState, useEffect } from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Navigate, useNavigate } from "react-router-dom";


export const Habits = () => {


  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const today = new Date().toISOString().split('T')[0];
  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("Debes iniciar sesión para acceder a esta página.");
      navigate("/login");
      return;
    }
    const user = JSON.parse(storedUser);
    setUserName(user.name)
    fetchHabits();
  }, [])

  const fetchHabits = async () => {
    if (!token) {
      alert("No has iniciado sesion");
      return;
    }

    const result = await fetch(backendUrl + "api/daily_habits/" + today, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (result.ok) {
      const data = await result.json();
      const habits = data.habits;

      setDidTrain(habits.entreno);
      setTrainingType(habits.ejercicio || '');
      setSleepQuality(habits.sueño || '');
      setFoodTotal({
        caloriesTotal: habits.calorias || 0,
        proteinTotal: habits.proteinas || 0
      });
    }
  };

  const [didTrain, setDidTrain] = useState(null);
  const [trainingType, setTrainingType] = useState('');
  const [sleepQuality, setSleepQuality] = useState('');
  const [breakfast, setBreakfast] = useState({
    meal: '',
    calories: 0,
    protein: 0,
  });
  const [lunch, setLunch] = useState({
    meal: '',
    calories: 0,
    protein: 0,
  });
  const [dinner, setDinner] = useState({
    meal: '',
    calories: 0,
    protein: 0,
  });
  const [foodTotal, setFoodTotal] = useState({
    caloriesTotal: 0,
    proteinTotal: 0
  });

  useEffect(() => {
    const totalCalories = breakfast.calories + lunch.calories + dinner.calories
    const totalProtein = breakfast.protein + lunch.protein + dinner.protein

    setFoodTotal({
      caloriesTotal: totalCalories,
      proteinTotal: totalProtein
    });
  }, [breakfast, lunch, dinner]);

  const handleMealChange = (mealType, field, e) => {

    const value = field === "calories" || field === "protein" ? parseInt(e.target.value) || 0 : e.target.value;
    if (mealType === "desayunaste") {
      setBreakfast({ ...breakfast, [field]: value })
    }
    else if (mealType === "almorzaste") {
      setLunch({ ...lunch, [field]: value })
    }
    else {
      setDinner({ ...dinner, [field]: value })
    }
  }

  const getMealState = (mealType) => {
    switch (mealType) {
      case "desayunaste":
        return breakfast;
      case "almorzaste":
        return lunch;
      case "cenaste":
        return dinner;
      default:
        return { meal: '', calories: 0, protein: 0 };
    }
  };

  const dailyExists = async () => {
    const result = await fetch(backendUrl + "api/daily_habits/" + today, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    if (result.ok){
      return true;
    }
    else return false;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const exists = await dailyExists()
    if (exists) {
      const confirmUpdate = window.confirm("Ya has registrado tus hábitos hoy. ¿Deseas actualizarlos?");
      if (!confirmUpdate) {
        return;
      }
    }

    const method = exists ? "PUT" : "POST";

    if (!token) {
      alert("No has iniciado sesion");
      return;
    }

    if (didTrain === null) {
      return alert("Por favor, indica si entrenaste hoy.");
    }
    if (didTrain === true && trainingType === '') {
      return alert("Por favor, selecciona el tipo de entrenamiento.");
    }
    if (didTrain === false && trainingType !== '') {
      return alert("Si no entrenaste, no es necesario seleccionar el tipo de entrenamiento.");
    }
    if (sleepQuality === '') {
      return alert("Por favor, indica la calidad de tu sueño.");
    }
    if (breakfast.calories < 0 && lunch.calories < 0 && dinner.calories < 0) {
      return alert("Las calorias no pueden ser negativas.");
    }
    if (breakfast.calories > 5000 || lunch.calories > 5000 || dinner.calories > 5000) {
      return alert("Por favor, verifica las caalorias ingresadas, es un valor muy alto.");
    }
    if (breakfast.protein < 0 && lunch.protein < 0 && dinner.protein < 0) {
      return alert("Las proteinas no pueden ser negativas.");
    }
    if (breakfast.protein > 500 || lunch.protein > 500 || dinner.protein > 500) {
      return alert("Por favor, verifica las proteínas ingresadas, es un valor muy alto.");
    }

    await fetch(backendUrl + "api/daily_habits/" + today, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        date: today,
        habits: {
            entreno: didTrain,
            ejercicio: trainingType,
            sueño: sleepQuality,
            calorias: foodTotal.caloriesTotal,
            proteinas: foodTotal.proteinTotal,
          }
      }),
    },
    );
    navigate("/");
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">¡Tus hábitos saludables de hoy!</h2>

      <form onSubmit={handleSubmit}>
        <div className="card p-4 mb-4 shadow-sm">
          <h5 className="mb-3">Hola {userName}, ¿Entrenaste hoy?</h5>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="didTrain" id="trainYes" onChange={() => setDidTrain(true)} value="true" checked={didTrain === true} />
            <label className="form-check-label" htmlFor="trainYes">Sí</label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="didTrain" onChange={() => setDidTrain(false)} id="trainNo" value="false" checked={didTrain === false} />
            <label className="form-check-label" htmlFor="trainNo">No</label>
          </div>

          <hr />

          <h6 className="mb-3">¿Qué entrenaste hoy?</h6>
          {["Tren Superior", "Tren Inferior", "Cardio"].map((part, index) => (
            <div className="form-check" key={index}>
              <input className="form-check-input" type="radio" onChange={() => setTrainingType(`${part}`)} name="trainingType" id={`type${index}`} value={part} checked={trainingType === part} disabled={didTrain === false}/>
              <label className="form-check-label" htmlFor={`type${index}`}>{part}</label>
            </div>
          ))}
        </div>

        <div className="card p-4 mb-4 shadow-sm">
          <h5 className="mb-3">¿Qué tal dormiste anoche?</h5>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="sleep" id="sleepGood" value="Good" onChange={() => setSleepQuality("Good")} checked={sleepQuality === "Good"} />
            <label className="form-check-label" htmlFor="sleepGood">
              <i className="fa-solid fa-face-smile text-success fs-4"></i>
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="sleep" id="sleepBad" value="Bad" onChange={() => setSleepQuality("Bad")} checked={sleepQuality === "Bad"} />
            <label className="form-check-label" htmlFor="sleepBad">
              <i className="fa-solid fa-face-frown text-danger fs-4"></i>
            </label>
          </div>
        </div>

        <div className="card p-4 mb-4 shadow-sm">
          <h5 className="mb-4">Hagamos un recuento de tus calorías</h5>

          {["desayunaste", "almorzaste", "cenaste"].map((meal, idx) => {
            const mealState = getMealState(meal);

            return (
              <div key={idx} className="mb-4">
                <label htmlFor={`meal${idx}`} className="form-label">
                  ¿Qué {meal} hoy?
                </label>
                <input
                  type="text"
                  className="form-control mb-3"
                  id={`meal${idx}`}
                  required
                  value={mealState.meal}
                  onChange={(e) => handleMealChange(meal, "meal", e)}
                />

                <div className="row g-3 align-items-center">
                  <div className="col-md-4">
                    <label htmlFor={`cal${idx}`} className="form-label">Calorías estimadas:</label>
                    <input
                      type="number"
                      className="form-control"
                      id={`cal${idx}`}
                      value={mealState.calories}
                      onChange={(e) => handleMealChange(meal, "calories", e)}
                    />
                  </div>
                  <div className="col-md-4">
                    <label htmlFor={`prot${idx}`} className="form-label">Proteínas estimadas:</label>
                    <input
                      type="number"
                      className="form-control"
                      id={`prot${idx}`}
                      value={mealState.protein}
                      onChange={(e) => handleMealChange(meal, "protein", e)}
                    />
                  </div>
                </div>
              </div>
            );
          })}

        </div>

        <div className="text-center mt-5 mb-3">
          <h4>Total de Calorías y Proteinas hoy: <span className="text-success">{foodTotal.caloriesTotal} kcal y {foodTotal.proteinTotal} gr de Proteina</span></h4>
          <button type="submit" className="btn btn-success btn-lg mt-3">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}; 