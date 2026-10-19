import { Navigate, Route, Routes } from "react-router-dom";
import AppNavBar from "./components/AppNavBar";
import CategoryList from "./pages/CategoryList";
import EditCategory from "./pages/EditCategory";

export default function App() {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <AppNavBar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Navigate to="/categories" replace />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/categories/:id/edit" element={<EditCategory />} />
          <Route path="*" element={<Navigate to="/categories" replace />} />
        </Routes>
      </main>
      <footer className="py-3 bg-white border-top text-center text-muted small mt-auto">
        <div className="container">
          FUNewsManagementSystem &bull; SBA301 - Integrate Single Page Application with Spring Boot &bull; Slot 23 (Chapter 15 Part B)
        </div>
      </footer>
    </div>
  );
}
