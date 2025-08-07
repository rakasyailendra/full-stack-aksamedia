import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import "./index.css";
import { Toaster } from "react-hot-toast";

// --- Impor Komponen & Halaman ---
// Nama dibuat lebih jelas untuk menghindari kebingungan
import Navbar from "./components/navbar";
import Loading from "./components/loading";
import LoginPage from "./pages/auth/login";
import ProfilePage from "./pages/auth/profile";
import DashboardPage from "./pages/dashboard"; // Halaman dasbor utama
import EmployeeListPage from "./pages/dashboard/Datapegawai"; // Halaman data karyawan (dari index.tsx)
import CreateEmployeePage from "./pages/dashboard/create";
import UpdateEmployeePage from "./pages/dashboard/update";

// --- Layout Utama ---
// Kerangka utama yang berisi Navbar dan latar belakang yang responsif terhadap tema.
const MainLayout = () => {
  return (
    // Latar belakang disempurnakan untuk tema terang (putih keabuan) dan gelap (biru keabuan)
    <div className="min-h-screen w-full bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

// --- Konfigurasi Router ---
const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true, // Halaman default ("/") akan menampilkan Dasbor
        element: <DashboardPage />,
      },
      {
        path: "data-karyawan", // Halaman untuk "/data-karyawan"
        element: <EmployeeListPage />,
      },
      {
        path: "create/user",
        element: <CreateEmployeePage />,
      },
      {
        path: "update/user/:id",
        element: <UpdateEmployeePage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },
]);

// --- Render Aplikasi ---
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster />
    <RouterProvider router={router} fallbackElement={<Loading />} />
  </StrictMode>
);
