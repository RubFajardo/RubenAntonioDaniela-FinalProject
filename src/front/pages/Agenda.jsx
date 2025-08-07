import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "../styles/agendaStyles.css";

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
        loadProfilePic()
    }, [token, navigate]);

    if (!token || !user) {
        return null;
    }

    const [date, setDate] = useState(new Date());
    const [view, setView] = useState("month");
    const [habits, setHabits] = useState([]);
    const [profilePic, setProfilePic] = useState("https://cdn-icons-png.flaticon.com/512/16/16480.png");
    const loadProfilePic = () => {
        const user = JSON.parse(localStorage.getItem("user"))
        if (user.profile_pic) {
            setProfilePic(user.profile_pic)
        }
    }

    const changeProfilePic = () => {
        const newUrl = prompt("Ingresa la URL de la nueva foto de perfil:");
        if (newUrl) {
            setProfilePic(newUrl);
        }
    };

    const formatDate = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const fetchMonthHabits = async (targetDate) => {
        const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
        const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
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
        if (response.status === 401) {
            alert("Tu sesion ha expirado, por favor inicia sesion nuevamente.");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            navigate("/login");
            return;
        }
        if (Array.isArray(data)) {
            setHabits(data);
        } else {
            setHabits([]);
        }
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
        if (response.status === 401) {
            alert("Tu sesion ha expirado, por favor inicia sesion nuevamente.");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            navigate("/login");
            return;
        }
        if (Array.isArray(data) && data.length === 0) {
            setHabits([]);
        } else if (data.habits && Object.keys(data.habits).length > 0) {
            setHabits([data]);
        } else {
            setHabits([]);
        }
    };

    useEffect(() => {
        if (view === "month") {
            fetchMonthHabits(date)
        }
    }, [date, view]);

    const onSelectDay = (selectedDate) => {
        setDate(selectedDate);
        setView("day");
        fetchDayHabits(selectedDate);
    };

    const onActiveStartDate = ({ activeStartDate }) => {
        setDate(activeStartDate);
        if (view === "day") {
            fetchDayHabits(activeStartDate);
        } else {
            fetchMonthHabits(activeStartDate);
        }
    };

    useEffect(() => {

    }, [])

    return (
        <div className="container mt-5">
            <div className="row justify-content-around mb-4">
                <div className="card shadow" style={{ width: '400px', flexShrink: 0 }}>
                    <div className="card-body text-center">
                        {/* Usamos el estado para la foto */}
                        <img
                            src={profilePic}
                            alt="Profile"
                            className="rounded-circle mb-3"
                            width="150"
                            height="150"
                        />
                        <button onClick={changeProfilePic}><i className="fa-solid fa-pencil"></i></button>
                        <h3 className="card-title">{user.name}</h3>
                        <p className="card-text text-muted">{user.email}</p>
                    </div>
                </div>
                <div className="shadow px-0" style={{ width: '400px', flexShrink: 0 }}>
                    <Calendar
                        onClickDay={onSelectDay}
                        prev2Label={null}
                        minDetail="decade"
                        next2Label={null}
                        onActiveStartDateChange={({ activeStartDate }) => {
                            setDate(activeStartDate);
                            if (view === "month") {
                                fetchMonthHabits(activeStartDate);
                            } else if (view === "day") {
                                fetchDayHabits(activeStartDate);
                            }
                            setView("month")
                        }}
                        onViewChange={({ view }) => {
                            setView(view);
                        }}
                    />
                </div>
            </div>
            {(view == "day" || view == "month") ? (
                <p>
                    {view === "day" && `Tus hábitos del día ${date.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}:`}
                    {view === "month" && `Tus hábitos de ${date.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}:`}
                </p>
            ) : null}
            {view === "day" && (
                <button className="btn btn-secondary mb-3" onClick={() => { setView("month") }}>
                    Mostrar todo el mes
                </button>
            )}
            <div className={`d-flex overflow-auto gap-3 p-3 ${view === "day" ? "dayCardContainer" : "monthCardContainer"}`}>
                {(view === "day" || view === "month") && (
                    habits.length === 0 ? (
                        <p className="text-muted">
                            No se encontraron hábitos para este {view === "day" ? "día" : "mes"}.
                        </p>
                    ) : (
                        habits.map((habit, index) => (
                            <div key={index} className={`card shadow ${view === "day" ? "dayCard" : "monthCard"}`}>
                                <div className="card-body">
                                    <h5 className="card-title text-primary">{habit.date}</h5>
                                    <ul className="list-unstyled mb-0">
                                        <li><strong>Entreno:</strong> {habit.habits?.entreno ? "Sí" : "No"}</li>
                                        <li><strong>Ejercicio:</strong> {habit.habits?.ejercicio || "N/A"}</li>
                                        <li><strong>Sueño:</strong> {habit.habits?.sueño || "N/A"}</li>
                                        <li><strong>Calorías:</strong> {habit.habits?.calorias || "N/A"}</li>
                                        <li><strong>Proteínas:</strong> {habit.habits?.proteinas || "N/A"}</li>
                                    </ul>
                                </div>
                            </div>
                        )
                        )
                    )
                )}
            </div>
        </div>
    );
};
