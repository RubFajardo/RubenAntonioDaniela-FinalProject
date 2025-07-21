import React from 'react';

export const Home = () => {
  return (
    <div className="main-container container">

      <div className="goal-message text-center my-5">
        <h2>Tu bienestar, nuestro propósito</h2>
        <p>
          Somos una plataforma dedicada a ayudarte a construir una vida más saludable. A través del seguimiento de tus hábitos de <strong>ejercicio</strong>, <strong>alimentación</strong> y <strong>sueño</strong>, te guiamos para que logres un mejor equilibrio y bienestar integral.
        </p>
      </div>
      <div id="habitsCarousel" className="carousel slide mb-5" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="https://via.placeholder.com/800x400?text=Ejercicio" className="d-block w-100" alt="Ejercicio" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Ejercicio</h5>
              <p>Mejora tu energía y fortalece tu cuerpo con rutinas personalizadas.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img src="https://via.placeholder.com/800x400?text=Alimentación" className="d-block w-100" alt="Alimentación" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Alimentación</h5>
              <p>Registra tus comidas y mantén una dieta balanceada y consciente.</p>
            </div>
          </div>
          <div className="carousel-item">
            <img src="https://via.placeholder.com/800x400?text=Sueño" className="d-block w-100" alt="Sueño" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Sueño</h5>
              <p>Optimiza tus hábitos de descanso para una mente y cuerpo renovados.</p>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#habitsCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#habitsCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>

      <div className="contact-container text-center my-5">
        <h4>Contacto</h4>
        <p>
          ¿Tienes dudas? Escríbenos a <a href="mailto:contacto@habitstracker.com">contacto@habitstracker.com</a>
        </p>
      </div>      
    </div>
  );
};

export default Home;
