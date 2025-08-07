
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar"; // Pastikan path ini benar

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main>
        {/* Halaman Dashboard atau Data Karyawan akan muncul di sini */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;