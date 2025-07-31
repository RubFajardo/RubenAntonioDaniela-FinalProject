import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { es } from 'date-fns/locale/es';
registerLocale("es", es);


export const Agenda = () => {

    const token = localStorage.getItem("token")
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [dateHabits, setDateHabits] = useState([]);


    if (!token) {
        return alert("necesitas iniciar sesión para acceder a este campo")
    }
    const user = JSON.parse(localStorage.getItem("user"))

    const daily = async (start, end) => {

        const startDay = start.toISOString().split("T")[0];
        const endDay = end.toISOString().split("T")[0];

        let url = "";
        if (startDay === endDay) {
            url = backendUrl + "api/daily_habits/" + startDay;
        } else {
            url = backendUrl + "api/daily_habits/" + startDay + "/" + endDay;
        }

        const result = await fetch(url, {
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await result.json();

        if (startDay === endDay) {
            setDateHabits([data]);
        }
        else {
            setDateHabits(data || []);
        }
        return data;
    }

    useEffect(() => {
        daily(new Date(), new Date());
    }, []);

    return (
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
                    <Link to={"/register"}>
                        <button><i className="fa-solid fa-pencil"></i></button>
                    </Link>
                    <h3 className="card-title">{user.name}</h3>
                    <p className="card-text text-muted">{user.email}</p>
                </div>
            </div>
            <div>
                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} locale={"es"} dateFormat="yyyy-MM-dd" />
                <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} locale={"es"} dateFormat="yyyy-MM-dd" />
                <button onClick={() => { daily(startDate, endDate) }}>Filtrar</button>
            </div>
            <div>
                <ul>
                    {dateHabits.length === 0 && <li>No hay registros</li>}
                    {dateHabits.map((day) => (
                        <li key={day.id}>
                            <strong>Fecha:</strong> {day.date}
                            <ul>
                                {day.habits.length === 0 && <li>No hay hábitos para esta fecha</li>}
                                {day.habits.map((habit) => (
                                    <li key={habit.id}>
                                        <strong>Ejercicio:</strong> {habit.ejercicio} |{" "}
                                        <strong>Sueño:</strong> {habit.sueño} |{" "}
                                        <strong>Entreno:</strong> {habit.entreno ? "Sí" : "No"} |{" "}
                                        <strong>Calorías:</strong> {habit.calorias} |{" "}
                                        <strong>Proteínas:</strong> {habit.proteinas}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
