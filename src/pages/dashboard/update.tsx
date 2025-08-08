// File: src/pages/dashboard/update.tsx (Versi Halaman Nonaktif)

import { Link } from "react-router-dom";
import Container from "../../components/Container";
import Navbar from "../../components/navbar";

const UpdateEmployeePageDisabled = () => {
  return (
    <>
      <Navbar />
      <Container>
        <div className="max-w-2xl mx-auto pt-8 text-center">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Fitur Belum Tersedia</h2>
            <p className="mb-6 text-gray-500 dark:text-gray-400">
              Halaman untuk mengedit data pegawai memerlukan koneksi ke database. Fitur ini akan berfungsi penuh setelah backend di-deploy dan terhubung.
            </p>
            <Link 
              to="/data-pegawai" 
              className="bg-indigo-600 text-white rounded-lg px-5 py-2.5 hover:bg-indigo-700"
            >
              Kembali ke Daftar Pegawai
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
};

export default UpdateEmployeePageDisabled;