import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom";

export const Agenda = () => {

    const token = localStorage.getItem("token");
    if (!token) {
        return alert("pagina solo para usuarios logeados")
    }

    const userName = JSON.parse(localStorage.getItem("user"));

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
                    <h3 className="card-title">{userName.name}</h3>
                    <p className="card-text text-muted">{userName.email}</p>
                </div>
            </div>
        </div>
    );
};
