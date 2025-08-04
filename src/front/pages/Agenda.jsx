import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "../styles/calendarStyles.css";

export const Agenda = () => {

    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user"))
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            alert("Necesitas iniciar sesión para acceder a este campo");
            navigate("/login");
        }
    }, [token, navigate]);

    const [date, setDate] = useState(new Date());
    const [view, setView] = useState("month");
    const [habits, setHabits] = useState([]);

    const formatDate = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const fetchMonthHabits = async () => {

        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const start = formatDate(startOfMonth);
        const end = formatDate(endOfMonth);

        const response = await fetch(backendUrl + "/api/daily_habits/" + start + "/" + end, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
        });
        const data = await response.json();
        setHabits(data);
    };

    const fetchDayHabits = async (selectedDate) => {
        const formattedDate = formatDate(selectedDate);
        const response = await fetch(backendUrl + "/api/daily_habits/" + formattedDate, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
        });
        const data = await response.json();
        console.log(formattedDate);
        setHabits([data]);
    };

    useEffect(() => {
        if (view == "month") {
            fetchMonthHabits()
        }
    }, [date, view]);

    const onSelectDate = (selectedDate) => {
        setDate(selectedDate);
        setView("day");
        fetchDayHabits(selectedDate);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-around mb-4">
                <div className="card shadow" style={{ width: '400px', flexShrink: 0 }}>
                    <div className="card-body text-center">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/16/16480.png"
                            alt="Profile"
                            className="rounded-circle mb-3"
                            width="150"
                            height="150"
                        />
                        <button><i className="fa-solid fa-pencil"></i></button>
                        <h3 className="card-title">{user.name}</h3>
                        <p className="card-text text-muted">{user.email}</p>
                    </div>
                </div>
                <div className="shadow px-0" style={{ width: '400px', flexShrink: 0 }}>
                    <Calendar onChange={onSelectDate} />
                </div>
            </div>
            {view === "day" && (
                <button className="btn btn-secondary mb-3" onClick={() => { setView("month") }}>
                    Mostrar todo el mes
                </button>
            )}
            <div className={`d-flex overflow-auto gap-3 p-3 ${view === "day" ? "dayCardContainer" : "monthCardContainer"}`}>
                {habits.map((habit, index) => {
                    return (
                        <div key={index} className={`card shadow ${view === "day" ? "dayCard" : "monthCard"}`}>
                            <div className="card-body">
                                <h5 className="card-title text-primary">{habit.date}</h5>
                                <ul className="list-unstyled mb-0">
                                    <li><strong>Entreno:</strong> {habit.habits?.entreno ? "Si" : "No"}</li>
                                    <li><strong>Ejercicio:</strong> {habit.habits?.ejercicio}</li>
                                    <li><strong>Sueño:</strong> {habit.habits?.sueño}</li>
                                    <li><strong>Calorías:</strong> {habit.habits?.calorias}</li>
                                    <li><strong>Proteínas:</strong> {habit.habits?.proteinas}</li>

                                </ul>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};