import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/habits.css";

export const Habits = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
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
      headers: { "Authorization": "Bearer " + token }
    });
    if (result.ok) {
      const data = await result.json();
      if (result.status === 401) {
        alert("Tu sesion ha expirado, por favor inicia sesion nuevamente.");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      if (!data.habits) return;
      const habits = data.habits;
      setDidTrain(habits.entrenamientos);
      setTrainingType(habits.ejercicio || '');
      setSleepQuality(habits.sueño || '');
      setFoodTotal({
        caloriesTotal: habits.calorias || 0,
        proteinTotal: habits.proteinas || 0
      });
      setBreakfast(prev => ({ ...prev, meal: habits.breakfast || '' }));
      setLunch(prev => ({ ...prev, meal: habits.lunch || '' }));
      setDinner(prev => ({ ...prev, meal: habits.dinner || '' }));
    }
  };

  const [didTrain, setDidTrain] = useState(null);
  const [trainingType, setTrainingType] = useState('');
  const [sleepQuality, setSleepQuality] = useState('');
  const [breakfast, setBreakfast] = useState({ meal: '', calories: 0, protein: 0 });
  const [lunch, setLunch] = useState({ meal: '', calories: 0, protein: 0 });
  const [dinner, setDinner] = useState({ meal: '', calories: 0, protein: 0 });
  const [foodTotal, setFoodTotal] = useState({ caloriesTotal: 0, proteinTotal: 0 });

  useEffect(() => {
    const totalCalories = breakfast.calories + lunch.calories + dinner.calories;
    const totalProtein = breakfast.protein + lunch.protein + dinner.protein;
    setFoodTotal({ caloriesTotal: totalCalories, proteinTotal: totalProtein });
  }, [breakfast, lunch, dinner]);

  const handleMealChange = (mealType, field, e) => {
    const value = field === "calories" || field === "protein" ? parseInt(e.target.value) || 0 : e.target.value;
    if (mealType === "desayunaste") setBreakfast({ ...breakfast, [field]: value });
    else if (mealType === "almorzaste") setLunch({ ...lunch, [field]: value });
    else setDinner({ ...dinner, [field]: value });
  };

  const getMealState = (mealType) => {
    switch (mealType) {
      case "desayunaste": return breakfast;
      case "almorzaste": return lunch;
      case "cenaste": return dinner;
      default: return { meal: '', calories: 0, protein: 0 };
    }
  };

  const dailyExists = async () => {
    const result = await fetch(backendUrl + "api/daily_habits/" + today, { headers: { "Authorization": "Bearer " + token } })
    if (!result.ok) return false;
    const data = await result.json()
    return data.habits !== null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const exists = await dailyExists();
    if (exists) {
      if (!window.confirm("Ya has registrado tus hábitos hoy. ¿Deseas actualizarlos?")) return;
    }
    const method = exists ? "PUT" : "POST";
    if (!token) { alert("No has iniciado sesion"); return; }
    if (didTrain === null) return alert("Por favor, indica si entrenaste hoy.");
    if (didTrain && trainingType === '') return alert("Por favor, selecciona el tipo de entrenamiento.");
    if (!didTrain && trainingType !== '') return alert("Si no entrenaste, no es necesario seleccionar el tipo de entrenamiento.");
    if (sleepQuality === '') return alert("Por favor, indica la calidad de tu sueño.");
    if (breakfast.calories < 0 && lunch.calories < 0 && dinner.calories < 0) return alert("Las calorias no pueden ser negativas.");
    if (breakfast.calories > 5000 || lunch.calories > 5000 || dinner.calories > 5000) return alert("Por favor, verifica las caalorias ingresadas, es un valor muy alto.");
    if (breakfast.protein < 0 && lunch.protein < 0 && dinner.protein < 0) return alert("Las proteinas no pueden ser negativas.");
    if (breakfast.protein > 500 || lunch.protein > 500 || dinner.protein > 500) return alert("Por favor, verifica las proteínas ingresadas, es un valor muy alto.");

    await fetch(backendUrl + "api/daily_habits/" + today, {
      method: method,
      headers: { "Content-Type": "application/json", 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ date: today, habits: { entrenamientos: didTrain, ejercicio: trainingType, sueño: sleepQuality, calorias: foodTotal.caloriesTotal, proteinas: foodTotal.proteinTotal, breakfast: breakfast.meal, lunch: lunch.meal, dinner: dinner.meal } }),
    });
    navigate("/perfil");
  };

  const getNutrientsAPI = async (meal) => {
    const mealState = getMealState(meal);
    try {
      const translatedFood = await translatorAPI(mealState.meal);
      const res = await fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-app-id": import.meta.env.VITE_NUTRITIONIX_APP_ID, "x-app-key": import.meta.env.VITE_NUTRITIONIX_API_KEY },
        body: JSON.stringify({ query: translatedFood })
      });
      const data = await res.json();
      const food = data.foods[0];
      if (!data.foods || data.foods.length === 0) { alert("No se encontró información para ese alimento."); return; }
      switch (meal) {
        case "desayunaste": setBreakfast(prev => ({ ...prev, calories: food.nf_calories, protein: food.nf_protein })); break;
        case "almorzaste": setLunch(prev => ({ ...prev, calories: food.nf_calories, protein: food.nf_protein })); break;
        case "cenaste": setDinner(prev => ({ ...prev, calories: food.nf_calories, protein: food.nf_protein })); break;
        default: break;
      }
    } catch (err) { alert("No se pudo obtener la info nutricional"); }
  };

  const translatorAPI = async (text) => {
    try {
      const res = await fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=en&dt=t&q=" + text);
      const data = await res.json()
      return data[0][0][0]
    } catch { return text; }
  };

  return (
    <div className="habitsContainer container mt-5">
      <h2 className="text-center mb-4 habitsTitle neonTitle">¡Tus hábitos saludables de hoy!</h2>

      <form onSubmit={handleSubmit}>
        {/* Entrenamiento */}
        <div className="habitCard card p-4 mb-4 shadow neonCard">
          <h5 className="mb-3 cardTitle">Hola {userName}, ¿Entrenaste hoy?</h5>
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
              <input className="form-check-input" type="radio" onChange={() => setTrainingType(`${part}`)} name="trainingType" id={`type${index}`} value={part} checked={trainingType === part} disabled={didTrain === false} />
              <label className="form-check-label" htmlFor={`type${index}`}>{part}</label>
            </div>
          ))}
        </div>

        {/* Sueño */}
        <div className="habitCard card p-4 mb-4 shadow neonCard">
          <h5 className="mb-3 cardTitle">¿Qué tal dormiste anoche?</h5>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="sleep" id="sleepGood" value="Dormí bien" onChange={() => setSleepQuality("Dormí bien")} checked={sleepQuality === "Dormí bien"} />
            <label className="form-check-label" htmlFor="sleepGood">
              <i className="fa-solid fa-face-smile text-success me-2 fs-4"></i> ¡Dormí muy bien!
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" name="sleep" id="sleepBad" value="Dormí mal" onChange={() => setSleepQuality("Dormí mal")} checked={sleepQuality === "Dormí mal"} />
            <label className="form-check-label" htmlFor="sleepBad">
              <i className="fa-solid fa-face-frown text-danger me-2 fs-4"></i> No pude dormir bien
            </label>
          </div>
        </div>

        {/* Comidas */}
        <div className="habitCard card p-4 mb-4 shadow neonCard">
          <h5 className="mb-4 cardTitle">Hagamos un recuento de tus comidas</h5>

          {["desayunaste", "almorzaste", "cenaste"].map((meal, idx) => (
            <div key={idx} className="mb-3">
              <label className="form-label text-light">¿Qué {meal}?</label>
              <input type="text" className="form-control neonInput mb-2" value={getMealState(meal).meal} onChange={(e) => handleMealChange(meal, "meal", e)} />
              <button type="button" className="btn btn-outline-success mb-3 mt-1" onClick={() => getNutrientsAPI(meal)}>Calcular nutrientes</button>
              <div className="d-flex gap-2">
                <input type="number" className="form-control neonInput" value={getMealState(meal).calories} onChange={(e) => handleMealChange(meal, "calories", e)} />
                <input type="number" className="form-control neonInput" value={getMealState(meal).protein} onChange={(e) => handleMealChange(meal, "protein", e)} />
              </div>
            </div>
          ))}

          <div className="mt-3 text-end text-light fw-bold">
            Total Calorías: {foodTotal.caloriesTotal} | Total Proteínas: {foodTotal.proteinTotal}g
          </div>
        </div>

        <button type="submit" className="btn w-100 neonButton">Guardar hábitos</button>
      </form>
    </div>
  );
};
