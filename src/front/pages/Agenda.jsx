import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "../styles/agendaStyles.css";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Modal } from 'bootstrap';

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

    const tilesColor = ({ date, view }) => {
        if (view !== "month") return null;

        const formattedDate = formatDate(date);

        const hasHabits = habits.find(h => h.date === formattedDate);
        if (!hasHabits || !hasHabits.habits) return null;

        if (hasHabits.habits.entreno === true) return "tile-with-entreno"
        if (hasHabits.habits.entreno === false) return "tile-with-habits"
        return null;
    }

    const chartData = habits.map((h) => ({
        date: new Date(h.date).toLocaleDateString('es-ES', {
            weekday: 'short',
            day: '2-digit'
        }),
        Calorias: h.habits?.calorias || 0,
        Proteinas: h.habits?.proteinas || 0,
    }));
    
    const deleteUser = async () => {
        if (!token) {
            alert("Tu sesión ha caducado, inicia sesión antes de continuar.");
            return;
        }

        try {
            const res = await fetch(`${backendUrl}api/delete_user/`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + token
                }
            });

            if (!res.ok) {
                const errorData = await res.json();
                alert(errorData.message || "Error al eliminar usuario");
                return;
            }

            const data = await res.json();
            alert(data.message);

            const modalEl = document.getElementById('deleteUser');
            const modalInstance = Modal.getInstance(modalEl) || new Modal(modalEl);
            modalInstance.hide();

            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.parentNode.removeChild(backdrop);
            }
            document.body.classList.remove('modal-open');

            setTimeout(() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.dispatchEvent(new Event("userChanged"));
                navigate("/login");
            }, 300);

        } catch (err) {
            console.error("Error eliminando usuario:", err);
            alert("No se pudo eliminar el usuario");
        }
    };

    return (
        <div className="container mt-5">

            {/* Perfil */}

            <div className="profileAndChartContainer">
                <div className="profileCard">
                    <div className="profileBody">
                        <div className="imageAndEdit">
                            <img src={profilePic} alt="Profile" className="profileImage" />
                            <button onClick={changeProfilePic} className="editImage">
                                <i className="fa-solid fa-pencil"></i>
                            </button>
                        </div>
                        <h3 className="CardName">{user.name}</h3>
                        <p className="CardEmail">{user.email}</p>
                    </div>
                    <button type="button" className="btn btn-danger mb-2" data-bs-toggle="modal" data-bs-target="#deleteUser">
                        Eliminar Cuenta
                    </button>
                    <div className="modal fade" id="deleteUser" tabindex="-1" aria-labelledby="deleteUserLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="deleteUserLabel">Eliminar Cuenta</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    ¿Estas seguro de que deseas eliminar tu cuenta? !No podrás recuperarla!
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                    <button type="button" onClick={() => deleteUser()} className="btn btn-danger">Sí, deseo eliminar mi cuenta</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grafico */}

                {view === "month" && chartData.length > 0 && (
                    <div className="monthlyChart">
                        <div className="chartContainer">
                            <LineChart width={450} height={200} data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="4 4" stroke="#666" />
                                <XAxis dataKey="date" stroke="#fff" tick={{ fontSize: 12 }} axisLine={{ stroke: '#fff' }} />
                                <YAxis stroke="#fff" tick={{ fontSize: 12 }} axisLine={{ stroke: '#fff' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#222', borderRadius: '8px', color: '#fff', border: "1px solid #ffcc00", boxShadow: "0 0 8px 2px #ff6f00" }} labelStyle={{ fontWeight: 'bold' }} cursor={{ stroke: '#fff', strokeWidth: 2 }} />
                                <Legend verticalAlign="top" align="center" height={36} wrapperStyle={{ fontSize: '14px', fontWeight: 'bold'}} />
                                <Line type="monotone" dataKey="Calorias" stroke="#ff6f00" dot={{ r: 3, strokeWidth: 0, fill: '#ff6f00' }} activeDot={{ r: 6, strokeWidth: 0, fill: "#ff6f00" }} />
                                <Line type="monotone" dataKey="Proteinas" stroke="#ffcc00" dot={{ r: 3, strokeWidth: 0, fill: '#ffcc00' }} activeDot={{ r: 6, strokeWidth: 0, fill: "#ffcc00" }} />
                            </LineChart>
                            <h4>Resumen mensual de calorías y proteínas</h4>
                        </div>
                    </div>
                )}
            </div>

            {/* Calendario */}

            <div className="calendarContainer" style={{ width: '400px', flexShrink: 0 }}>
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
                        setView("month");
                    }}
                    onViewChange={({ view }) => {
                        setView(view);
                    }}
                    tileClassName={tilesColor}
                />
            </div>

            {/* Título de hábitos */}

            {(view == "day" || view == "month") ? (
                <p>
                    {view === "day" && `Tus hábitos del día ${date.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}:`}
                    {view === "month" && `Tus hábitos de ${date.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}:`}
                </p>
            ) : null}

            {/* Botón volver al mes */}
            {view === "day" && (
                <button className="btn btn-secondary mb-3" onClick={() => { setView("month") }}>
                    Mostrar todo el mes
                </button>
            )}

            {/* Tarjetas de hábitos */}

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
                        ))
                    )
                )}
            </div>
        </div>
    );
};
