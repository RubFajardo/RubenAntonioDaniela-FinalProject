import styles from "../styles/Footer.module.css"

export const Footer = () => (
	 <footer className={`footer text-center pt-5 pb-3 ${styles.footer}`}>
        <p>&copy; 2025 HabitsTracker. Todos los derechos reservados.</p>
        <div className="tech-icons d-flex justify-content-center gap-3">
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" alt="Bootstrap" width="30" height="30" />
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" width="30" height="30" />
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" width="30" height="30" />
        </div>
      </footer>
);
