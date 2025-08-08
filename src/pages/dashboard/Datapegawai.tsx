// File: src/pages/dashboard/Datapegawai.tsx (Versi Data Dummy)

import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../../components/modal";
import { EditIcon, TrashIcon, PlusIcon, SearchIcon } from "../../components/icons";

// --- Tipe Data (Tetap kita gunakan) ---
interface Division {
  id: string;
  name: string;
}

interface Employee {
  id: string;
  name: string;
  phone: string;
  position: string;
  image: string;
  division: Division;
}

// --- DATA DUMMY DITAMBAHKAN DI SINI ---
const dummyDivisions: Division[] = [
    { id: '1', name: 'Teknologi' },
    { id: '2', name: 'Pemasaran' },
    { id: '3', name: 'Sumber Daya Manusia' },
];

const dummyEmployees: Employee[] = [
    { id: '1', name: 'Budi Santoso (Dummy)', phone: '081234567890', position: 'Frontend Developer', image: 'https://placehold.co/40x40/3498db/ffffff?text=B', division: dummyDivisions[0] },
    { id: '2', name: 'Siti Aminah (Dummy)', phone: '082345678901', position: 'Backend Developer', image: 'https://placehold.co/40x40/e74c3c/ffffff?text=S', division: dummyDivisions[0] },
    { id: '3', name: 'Ahmad Yani (Dummy)', phone: '083456789012', position: 'Digital Marketer', image: 'https://placehold.co/40x40/2ecc71/ffffff?text=A', division: dummyDivisions[1] },
    { id: '4', name: 'Dewi Lestari (Dummy)', phone: '084567890123', position: 'UI/UX Designer', image: 'https://placehold.co/40x40/f1c40f/ffffff?text=D', division: dummyDivisions[0] },
    { id: '5', name: 'Eko Prasetyo (Dummy)', phone: '085678901234', position: 'HR Staff', image: 'https://placehold.co/40x40/9b59b6/ffffff?text=E', division: dummyDivisions[2] },
];

const EmployeeListPage = () => {
  // State untuk modal hapus kita biarkan, tapi fungsinya tidak memanggil API
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Data Pegawai</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Menampilkan data pegawai (mode demo).</p>
        </div>
        <Link to="/create/user" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md">
          <PlusIcon />
          Tambah Pegawai
        </Link>
      </div>

      {/* Filter Section DIBUAT NON-FUNGSIONAL */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <SearchIcon />
            </div>
            <input
                type="text"
                placeholder="Cari nama pegawai..."
                className="w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
                disabled
            />
        </div>
        <select
            className="w-full sm:w-auto p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
            disabled
        >
            <option value="">Semua Divisi</option>
            {dummyDivisions.map(division => (
                <option key={division.id} value={division.id}>{division.name}</option>
            ))}
        </select>
        <button className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:bg-indigo-400" disabled>
          Terapkan Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Nama</th>
              <th scope="col" className="px-6 py-3">Telepon</th>
              <th scope="col" className="px-6 py-3">Jabatan</th>
              <th scope="col" className="px-6 py-3">Divisi</th>
              <th scope="col" className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dummyEmployees.length > 0 ? (
              dummyEmployees.map((employee) => (
                <tr key={employee.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                    <img src={employee.image} alt={employee.name} className="w-10 h-10 rounded-full object-cover" />
                    {employee.name}
                  </td>
                  <td className="px-6 py-4">{employee.phone}</td>
                  <td className="px-6 py-4">{employee.position}</td>
                  <td className="px-6 py-4">{employee.division?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Link to={`/update/user/${employee.id}`} className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"><EditIcon /></Link>
                      {/* Tombol hapus hanya akan membuka modal palsu */}
                      <button onClick={() => setModalOpen(true)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><TrashIcon /></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
                <tr><td colSpan={5} className="text-center p-8">Tidak ada data ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Tidak ada paginasi */}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => setModalOpen(false)} // Confirm hanya menutup modal
        title="Mode Demo"
        message="Fitur ini memerlukan koneksi ke database dan akan berfungsi setelah backend di-deploy."
      />
    </div>
  );
};

export default EmployeeListPage;