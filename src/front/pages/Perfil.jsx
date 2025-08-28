import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from "../styles/Perfil.module.css"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Modal } from 'bootstrap';

export const Perfil = () => {

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

    if (!token || !user) {
        return null;
    }

    const [date, setDate] = useState(new Date());
    const [view, setView] = useState("month");
    const [habits, setHabits] = useState([]);
    const [profilePic, setProfilePic] = useState(user.profile_pic);


    const changeProfilePic = async () => {
        const newUrl = prompt("Ingresa la URL de la nueva foto de perfil:");
        if (!newUrl) return;


        const promise = await fetch(backendUrl + "api/edit_profile", {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ profile_pic: newUrl })
        });

        if (!promise.ok) {
            const errorData = await promise.json();
            alert(errorData.message || "Error al actualizar foto de perfil");
            return;
        }

        setProfilePic(newUrl);
        const updatedUser = { ...user, profile_pic: newUrl };
        localStorage.setItem("user", JSON.stringify(updatedUser));
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

        if (hasHabits.habits.entrenamientos === true) return "tile-with-entrenamientos"
        if (hasHabits.habits.entrenamientos === false) return "tile-with-habits"
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

    const countUsageDays = () => {
        const today = new Date();
        const past30 = new Date();
        past30.setDate(today.getDate() - 30);

        const recentHabits = habits.filter(habit => {
            const habitsDate = new Date(habit.date);
            return habitsDate >= past30 && habitsDate <= today;
        });

        return recentHabits.length;
    }

    const getMedal = (countUsageDays) => {
        if (countUsageDays >= 30) return "🎉";
        if (countUsageDays >= 21) return "🥇";
        if (countUsageDays >= 14) return "🥈";
        if (countUsageDays >= 7) return "🥉";
        return null;
    }

    const daysUsed = countUsageDays(habits);
    const medal = getMedal(daysUsed);

    const allMedals = [
        { icon: "fa-medal", minDays: 7, color: "#cd7f32"},
        { icon: "fa-medal", minDays: 14, color: "#c0c0c0" },
        { icon: "fa-medal", minDays: 21, color: "#ffd700" },
        { icon: "fa-trophy", minDays: 30, color: "#ff7f00" },
    ];

    const unlockedMedals = allMedals.filter(medal => daysUsed >= medal.minDays).sort((a, b) => b.minDays - a.minDays);

    return (
        <div className="container mt-5">
            <div className={styles.profileAndChartContainer}>

                {/* Perfil */}

                <div className={styles.profileCard}>

                    {/* Foto y datos del perfil */}

                    <div>
                        <div className={styles.profilePicContainter}>
                            <img src={profilePic} alt="Profile" className={styles.profilePic} />
                            <button onClick={changeProfilePic} className={styles.editImage}>
                                <i className="fa-solid fa-pencil"></i>
                            </button>
                        </div>
                        <h3 className="card-title">{user.name}</h3>
                        <p className="card-text">{user.email}</p>
                    </div>

                    {/* Medalla */}

                    {unlockedMedals.length > 0 && (
                        <div className={styles.medalsContainer}>
                            {unlockedMedals.map((medal, index) => (
                                <div key={index} className={styles.medal}>
                                    <i className={`fa-solid h1 ${medal.icon}`} style={{color: medal.color}}></i>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Botón eliminar usuario */}

                    <button type="button" className={styles.deleteUser} data-bs-toggle="modal" data-bs-target="#deleteUser">
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </div>

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

                {/* Grafico */}

                {view === "month" && chartData.length > 0 && (
                    <div className={styles.monthlyChart}>
                        <LineChart width={450} height={200} data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="4 4" stroke="#666" />
                            <XAxis dataKey="date" stroke="#fff" tick={{ fontSize: 12 }} axisLine={{ stroke: '#fff' }} />
                            <YAxis stroke="#fff" tick={{ fontSize: 12 }} axisLine={{ stroke: '#fff' }} />
                            <Tooltip contentStyle={{ backgroundColor: '#0A0F24', borderRadius: '8px', color: '#fff', border: "1px solid #fff", boxShadow: "0 0 8px #01346A, 0 0 20px #027CFF" }} labelStyle={{ fontWeight: 'bold' }} cursor={{ stroke: '#fff', strokeWidth: 2 }} />
                            <Legend verticalAlign="top" align="center" height={36} wrapperStyle={{ fontSize: '14px', fontWeight: 'bold' }} />
                            <Line type="monotone" dataKey="Calorias" stroke="#fff" dot={{ r: 3, strokeWidth: 0, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0, fill: "#fff" }} />
                            <Line type="monotone" dataKey="Proteinas" stroke="#1E90FF" dot={{ r: 3, strokeWidth: 0, fill: '#1E90FF' }} activeDot={{ r: 6, strokeWidth: 0, fill: "#1E90FF" }} />
                        </LineChart>
                        <h4>Resumen mensual de calorías y proteínas</h4>
                    </div>
                )
                }
            </div >

            {/* Calendario */}

            < div className={styles.calendarContainer}>
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
            </div >

            {/* Título de hábitos */}

            <div className={styles.viewType}>
                {(view == "day" || view == "month") ? (
                    <h2 className={styles.viewText}>
                        {view === "day" && `Tus hábitos del día ${date.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}:`}
                        {view === "month" && `Tus hábitos de ${date.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}:`}
                    </h2>
                ) : null
                }

                {/* Botón volver al mes */}

                {view === "day" && (
                    <button className={`btn ${styles.showMonth}`} onClick={() => { setView("month") }}>
                        Mostrar todo el mes
                    </button>
                )
                }
            </div>

            {/* Tarjetas de hábitos */}

            <div className={`${styles.habitsContainer} ${styles.habitsScroll} ${view === "month" ? "month-view" : "day-view"}`}>
                {(view === "day" || view === "month") && (
                    habits.length === 0 ? (
                        <h2>
                            No se encontraron hábitos para este {view === "day" ? "día" : "mes"}.
                        </h2>
                    ) : (
                        habits.sort((a, b) => new Date(a.date) - new Date(b.date)).map((habit, index) => (
                            <div key={index} className={styles.habitCard}>
                                <div>
                                    <h5 className={styles.cardTitle}>{habit.date}</h5>
                                    <ul className="list-unstyled mb-0">
                                        <li><strong>¿Entrenaste?:</strong> {habit.habits?.entrenamientos ? "Sí" : "No"}</li>
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
        </div >
    );
};
