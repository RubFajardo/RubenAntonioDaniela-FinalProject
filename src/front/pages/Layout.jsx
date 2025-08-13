import { Outlet } from "react-router-dom/dist";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import styles from '../styles/Layout.module.css'; // asumiendo que usas módulo CSS

export const Layout = () => {
    return (
        <ScrollToTop>
            <div className={styles.layout}>
                <Navbar />
                <main className={styles.layoutMain}>
                    <Outlet />
                </main>
                <Footer />
            </div>
        </ScrollToTop>
    );
}
