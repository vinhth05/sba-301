import { Outlet } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";

export default function MainLayout() {
  return (
    <>
      <AppNavbar />
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer">
        SBA301 MiniStore SPA • React Router Demo • Trần Hiển Vinh (CE190881)
      </footer>
    </>
  );
}
