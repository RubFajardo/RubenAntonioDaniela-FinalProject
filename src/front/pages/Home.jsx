import React from 'react';

export const Home = () => {
        return (
                <div>
                        <section id="vision" className="vision-section d-flex align-items-center justify-content-center text-center">
                                <div className="vision-overlay">
                                        <h2 className="vision-title">Seguimiento de Hábitos Saludables</h2>
                                        <p className="vision-text">
                                                Mejorar tu bienestar empieza por cuidar tus hábitos. Nuestro enfoque integral se centra en tres pilares fundamentales: una alimentación consciente, actividad física regular y un descanso reparador.
                                        </p>
                                </div>
                        </section>
                        <section id="carrusel-imagenes" className="full-section carrusel-ruta-saludable">
                                <div className="titulo-sobre-carrusel">
                                        <h2>Tu Ruta Saludable</h2>
                                </div>
                                <div id="carouselHabitos" className="carousel slide w-100" data-bs-ride="carousel">
                                        <div className="carousel-inner">
                                                <div className="carousel-item active">
                                                        <img src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1" className="d-block w-100" alt="Ejercicio" />
                                                </div>
                                                <div className="carousel-item">
                                                        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836" alt="Alimentación" />
                                                </div>
                                                <div className="carousel-item">
                                                        <img src="https://phantom-elmundo.unidadeditorial.es/c0c11ddcd0e29d02b4c5b826d9bd2c5e/crop/72x0/2803x2048/resize/2560/f/webp/assets/multimedia/imagenes/2022/05/06/16518385882713.jpg" className="d-block w-100" alt="Sueño" />
                                                </div>
                                        </div>
                                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselHabitos" data-bs-slide="prev">
                                                <span className="carousel-control-prev-icon"></span>
                                        </button>
                                        <button className="carousel-control-next" type="button" data-bs-target="#carouselHabitos" data-bs-slide="next">
                                                <span className="carousel-control-next-icon"></span>
                                        </button>
                                </div>
                        </section>
<section id="testimonios" className="full-section bg-light py-5">
  <h2 className="mb-4 text-center">Testimonios Reales</h2>
  <div className="container">
    <div className="row justify-content-center g-4">
      <div className="col-md-4 d-flex">
        <div className="card sticky-note bg-white text-dark border-0 shadow-sm p-4 w-100 h-100 d-flex flex-column justify-content-between">
          <div className="card-body">
            <p className="card-text fst-italic">
              "Desde que sigo sus consejos, tengo más energía y duermo mejor. ¡Gracias por tanto contenido útil!"
            </p>
          </div>
          <p className="text-end fw-bold mb-0 px-3 pb-3">— Laura G.</p>
        </div>
      </div>
      <div className="col-md-4 d-flex">
        <div className="card sticky-note bg-white text-dark border-0 shadow-sm p-4 w-100 h-100 d-flex flex-column justify-content-between">
          <div className="card-body">
            <p className="card-text fst-italic">
              "Increíble lo fácil que es aplicar pequeños hábitos que cambian tu vida. ¡Muy recomendable!"
            </p>
          </div>
          <p className="text-end fw-bold mb-0 px-3 pb-3">— Marcos L.</p>
        </div>
      </div>
      <div className="col-md-4 d-flex">
        <div className="card sticky-note bg-white text-dark border-0 shadow-sm p-4 w-100 h-100 d-flex flex-column justify-content-between">
          <div className="card-body">
            <p className="card-text fst-italic">
              "Gracias a esta página, logré incorporar rutinas saludables que antes me parecían imposibles."
            </p>
          </div>
          <p className="text-end fw-bold mb-0 px-3 pb-3">— Natalia R.</p>
        </div>
      </div>
    </div>
  </div>
</section>



                        <section id="contacto" className="contacto">
                                <h2 className="mb-3">Contacto</h2>
                                <p className="lead">¿Tienes preguntas? ¡Estamos para ayudarte!</p>
                                <p>Email: <a href="mailto:contacto@habitosaludables.com">contacto@habitosaludables.com</a></p>
                                <p>Teléfono: +34 123 456 789</p>
                                <p>Dirección: Calle Bienestar 123, Madrid, España</p>
                        </section>
                </div>
        );
};
// Modificacion

