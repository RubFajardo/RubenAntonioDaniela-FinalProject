import React, { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom";

export const Agenda = () => {


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
                    <h3 className="card-title">Prueba</h3>
                    <p className="card-text text-muted">Pruebaemail@gmail.com</p>
                </div>
            </div>
        </div>
    );
};
