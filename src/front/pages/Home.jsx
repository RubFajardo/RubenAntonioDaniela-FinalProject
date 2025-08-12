import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';


export const Home = () => {
  const location = useLocation();
  const visionRef = useRef(null);
  const testimoniosRef = useRef(null);
  const contactoRef = useRef(null);

  const slides = [
    {
      img: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=1920&q=80',
      alt: 'Ejercicio',
      title: 'Ejercicio',
      description: 'Mantén tu cuerpo activo y saludable con ejercicios regulares.',
    },
    {
      img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80',
      alt: 'Alimentación',
      title: 'Alimentación',
      description: 'Sigue una alimentación consciente para nutrir tu cuerpo.',
    },
    {
      img: 'https://phantom-elmundo.unidadeditorial.es/c0c11ddcd0e29d02b4c5b826d9bd2c5e/crop/72x0/2803x2048/resize/2560/f/webp/assets/multimedia/imagenes/2022/05/06/16518385882713.jpg',
      alt: 'Sueño',
      title: 'Sueño',
      description: 'El descanso reparador es fundamental para tu bienestar.',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

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

  const prevSlide = () => {
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div>
      {/* SECCIÓN VISIÓN */}
      <section
        id="vision"
        className="vision-section d-flex align-items-center justify-content-center text-center"
        ref={visionRef}
      >
        <div className="vision-overlay-transparent">
          <h2 className="vision-title">Seguimiento de Hábitos Saludables</h2>
          <p className="vision-text">
            Mejorar tu bienestar empieza por cuidar tus hábitos. Nuestro enfoque integral se centra en tres pilares fundamentales: una alimentación consciente, actividad física regular y un descanso reparador.
          </p>
        </div>
      </section>

      {/* CARRUSEL */}
      <section id="carrusel-imagenes" className="carrusel-ruta-saludable no-gap">
        <div className="carousel-container">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`custom-carousel-item ${index === activeIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.img})` }}
              aria-label={slide.alt}
              role="img"
            ></div>
          ))}
          <div className="titulo-sobre-carrusel-overlay" aria-live="polite">
            <h2 className="carousel-title">{slides[activeIndex].title}</h2>
            <p className="carousel-description">{slides[activeIndex].description}</p>
          </div>
          <button
            className="carousel-control-prev"
            onClick={prevSlide}
            aria-label="Slide anterior"
            type="button"
          >
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button
            className="carousel-control-next"
            onClick={nextSlide}
            aria-label="Slide siguiente"
            type="button"
          >
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section id="testimonios" className="testimonios-section py-5" ref={testimoniosRef}>
        <h2 className="mb-4 text-center section-title">Testimonios Reales</h2>
        <div className="container">
          <div className="row justify-content-center g-4">
            <div className="col-md-4 d-flex">
              <div className="card sticky-note w-100 d-flex flex-column justify-content-between">
                <div className="card-body">
                  <p className="card-text fst-italic">
                    "Desde que sigo sus consejos, tengo más energía y duermo mejor. ¡Gracias por tanto contenido útil!"
                  </p>
                </div>
                <p className="text-end fw-bold mb-0 px-3 pb-3">— Laura G.</p>
              </div>
            </div>
            <div className="col-md-4 d-flex">
              <div className="card sticky-note w-100 d-flex flex-column justify-content-between">
                <div className="card-body">
                  <p className="card-text fst-italic">
                    "Increíble lo fácil que es aplicar pequeños hábitos que cambian tu vida. ¡Muy recomendable!"
                  </p>
                </div>
                <p className="text-end fw-bold mb-0 px-3 pb-3">— Marcos L.</p>
              </div>
            </div>
            <div className="col-md-4 d-flex">
              <div className="card sticky-note w-100 d-flex flex-column justify-content-between">
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

      {/* CONTACTO */}
      <section id="contacto" className="contacto" ref={contactoRef}>
        <h2 className="mb-3">Contacto</h2>
        <p className="lead">¿Tienes preguntas? ¡Estamos para ayudarte!</p>
        <p>Email: <a href="mailto:contacto@habitosaludables.com" style={{color:'#00ff99'}}>contacto@habitosaludables.com</a></p>
        <p>Teléfono: +34 123 456 789</p>
        <p>Dirección: Calle Bienestar 123, Madrid, España</p>
      </section>
    </div>
  );
};
