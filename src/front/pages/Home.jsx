import React from 'react';

export const Home = () => {
  return (
      <div>
      <section id="vision" className="full-section">
        <h2 className="mb-4">Seguimiento de Hábitos Saludables</h2>
        <p className="lead">
          Mejorar tu bienestar empieza por cuidar tus hábitos. Nuestro enfoque integral se centra en tres pilares fundamentales: una alimentación consciente, actividad física regular y un descanso reparador. Acompañamos tu progreso para ayudarte a alcanzar una vida más saludable y equilibrada.
        </p>
      </section>
      <section id="carrusel-imagenes" className="full-section">
        <h2 className="mb-4">Tu Ruta Saludable</h2>
        <div id="carouselHabitos" className="carousel slide w-100" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="https://www.google.com/imgres?q=ejercicios%20persona%20levantando%20pesas%20habito&imgurl=https%3A%2F%2Fwww.myprotein.es%2Fimages%3Furl%3Dhttps%3A%2F%2Fblogscdn.thehut.net%2Fapp%2Fuploads%2Fsites%2F450%2F2020%2F07%2FiStock-1175815322opt_hero_1593679552_1593778674_1200x672_acf_cropped.jpg%26auto%3Davif%26width%3D1200%26fit%3Dcrop&imgrefurl=https%3A%2F%2Fwww.myprotein.es%2Fthezone%2Fentrenamiento%2Flevantamiento-de-pesas-para-principiantes%2F&docid=TzH41h1bp5oMJM&tbnid=XsuugTmWDo3GUM&vet=12ahUKEwiHifPTudOOAxWBAPsDHbsbGv4QM3oECBEQAA..i&w=1200&h=672&hcb=2&ved=2ahUKEwiHifPTudOOAxWBAPsDHbsbGv4QM3oECBEQAA" className="d-block w-100" alt="Ejercicio" />
            </div>
            <div className="carousel-item">
              <img src="https://www.google.com/imgres?q=ejercicios%20persona%20levantando%20pesas%20habito&imgurl=https%3A%2F%2Fwww.myprotein.es%2Fimages%3Furl%3Dhttps%3A%2F%2Fblogscdn.thehut.net%2Fapp%2Fuploads%2Fsites%2F450%2F2020%2F07%2FiStock-1175815322opt_hero_1593679552_1593778674_1200x672_acf_cropped.jpg%26auto%3Davif%26width%3D1200%26fit%3Dcrop&imgrefurl=https%3A%2F%2Fwww.myprotein.es%2Fthezone%2Fentrenamiento%2Flevantamiento-de-pesas-para-principiantes%2F&docid=TzH41h1bp5oMJM&tbnid=XsuugTmWDo3GUM&vet=12ahUKEwiHifPTudOOAxWBAPsDHbsbGv4QM3oECBEQAA..i&w=1200&h=672&hcb=2&ved=2ahUKEwiHifPTudOOAxWBAPsDHbsbGv4QM3oECBEQAA" className="d-block w-100" alt="Alimentación" />
            </div>
            <div className="carousel-item">
              <img src="https://www.google.com/imgres?q=ejercicios%20persona%20levantando%20pesas%20habito&imgurl=https%3A%2F%2Fwww.myprotein.es%2Fimages%3Furl%3Dhttps%3A%2F%2Fblogscdn.thehut.net%2Fapp%2Fuploads%2Fsites%2F450%2F2020%2F07%2FiStock-1175815322opt_hero_1593679552_1593778674_1200x672_acf_cropped.jpg%26auto%3Davif%26width%3D1200%26fit%3Dcrop&imgrefurl=https%3A%2F%2Fwww.myprotein.es%2Fthezone%2Fentrenamiento%2Flevantamiento-de-pesas-para-principiantes%2F&docid=TzH41h1bp5oMJM&tbnid=XsuugTmWDo3GUM&vet=12ahUKEwiHifPTudOOAxWBAPsDHbsbGv4QM3oECBEQAA..i&w=1200&h=672&hcb=2&ved=2ahUKEwiHifPTudOOAxWBAPsDHbsbGv4QM3oECBEQAA" className="d-block w-100" alt="Sueño" />
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

      <section id="testimonios" className="full-section">
        <h2 className="mb-4">Testimonios Reales</h2>
        <div id="carouselTestimonios" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="testimonial">"Desde que uso esta herramienta, mis hábitos han mejorado radicalmente. Me siento con más energía cada día." – Carla R.</div>
            </div>
            <div className="carousel-item">
              <div className="testimonial">"El seguimiento me ayudó a ser constante y ver resultados. Es como tener un coach personal." – Miguel A.</div>
            </div
            <div className="carousel-item">
              <div className="testimonial">"Ahora duermo mejor, como mejor y hago ejercicio sin sentirlo como una obligación." – Paula G.</div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselTestimonios" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselTestimonios" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </section>
      
      <section id="contacto" className="full-section">
        <h2 className="mb-3">Contacto</h2>
        <p className="lead">¿Tienes preguntas? ¡Estamos para ayudarte!</p>
        <p>Email: <a href="mailto:contacto@habitosaludables.com">contacto@habitosaludables.com</a></p>
        <p>Teléfono: +34 123 456 789</p>
        <p>Dirección: Calle Bienestar 123, Madrid, España</p>
      </section>
    </div>
  );
};


