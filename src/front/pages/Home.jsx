import React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from "../styles/Home.module.css"


export const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);
  return (
    <div>

      {/* Vision */}

      <section id="vision" className={`${styles.visionSection} d-flex align-items-center justify-content-center text-center`}>
        <h2 className={styles.visionTitle}>Seguimiento de Hábitos Saludables</h2>
        <p className={styles.visionText}>
          Mejorar tu bienestar empieza por cuidar tus hábitos. Nuestro enfoque integral se centra en tres pilares fundamentales: una alimentación consciente, actividad física regular y un descanso reparador.
        </p>
      </section>

      {/* Carrusel */}

      <section id="carrusel-imagenes" className={`${styles.fullSection} ${styles.carruselRutaSaludable}`}>
        <div className={styles.tituloSobreCarrusel}>
          <h2>Tu Ruta Saludable</h2>
        </div>
        <div id="carouselHabitos" className="carousel slide w-100" data-bs-ride="carousel">
          <div className={`carousel-inner ${styles.carouselInner}`}>
            <div className={`carousel-item active ${styles.carouselItem}`}>
              <img
                src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1"
                className={styles.carouselItemImg + " d-block w-100"}
                alt="Ejercicio"
              />
            </div>
            <div className={`carousel-item ${styles.carouselItem}`}>
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
                className={styles.carouselItemImg + " d-block w-100"}
                alt="Alimentación"
              />
            </div>
            <div className={`carousel-item ${styles.carouselItem}`}>
              <img
                src="https://phantom-elmundo.unidadeditorial.es/c0c11ddcd0e29d02b4c5b826d9bd2c5e/crop/72x0/2803x2048/resize/2560/f/webp/assets/multimedia/imagenes/2022/05/06/16518385882713.jpg"
                className={styles.carouselItemImg + " d-block w-100"}
                alt="Sueño"
              />
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



      {/* Testimonios */}

      <section id="testimonios" className={`${styles.fullSection} ${styles.testimonios}`}>
        <h2 className={`mb-5 text-center ${styles.testimoniosTitle}`}>Testimonios Reales</h2>
        <div className="container">
          <div className="row justify-content-center g-4">
            <div className="col-md-4 d-flex">
              <div className={`card ${styles.stickyNote} border-0 shadow-sm p-4 w-100 h-100 d-flex flex-column justify-content-between`}>
                <div className="card-body">
                  <p className="card-text fst-italic">
                    "Desde que sigo sus consejos, tengo más energía y duermo mejor. ¡Gracias por tanto contenido útil!"
                  </p>
                </div>
                <p className="text-end fw-bold mb-0 px-3 pb-3">— Laura G.</p>
              </div>
            </div>
            <div className="col-md-4 d-flex">
              <div className={`card ${styles.stickyNote} border-0 shadow-sm p-4 w-100 h-100 d-flex flex-column justify-content-between`}>
                <div className="card-body">
                  <p className="card-text fst-italic">
                    "Increíble lo fácil que es aplicar pequeños hábitos que cambian tu vida. ¡Muy recomendable!"
                  </p>
                </div>
                <p className="text-end fw-bold mb-0 px-3 pb-3">— Marcos L.</p>
              </div>
            </div>
            <div className="col-md-4 d-flex">
              <div className={`card ${styles.stickyNote} border-0 shadow-sm p-4 w-100 h-100 d-flex flex-column justify-content-between`}>
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

      {/* Contacto */}

      <section id="contacto" className={styles.contacto}>
        <h2 className="mb-1">Contacto</h2>
        <p className="lead mb-4">¿Tienes preguntas? ¡Estamos para ayudarte!</p>
        <p>Teléfono: +34 123 456 789</p>
        <p>Email: <a href="mailto:contacto@habitosaludables.com">contacto@habitosaludables.com</a></p>
        <p>Dirección: Calle Bienestar 123, Madrid, España</p>
      </section>
    </div>
  );
};

