import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import ListOfOrchids from "./pages/ListOfOrchids";
import EditOrchid from "./pages/EditOrchid";

export default function App() {
  return (
    <div className="min-vh-100 bg-light">
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/orchids" replace />} />
        <Route path="/orchids" element={<ListOfOrchids />} />
        <Route path="/orchids/:id/edit" element={<EditOrchid />} />
        <Route path="*" element={<Navigate to="/orchids" replace />} />
      </Routes>
    </div>
  );
}
