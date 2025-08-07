import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Modal from "../../components/modal"; // Pastikan path ini benar

// --- Tipe Data (sesuai spesifikasi) ---
interface Employee {
  id: number;
  name: string;
  phone: string;
  division: string;
  position: string;
  image: string;
}

// --- Data Awal (Hanya untuk inisialisasi pertama kali) ---
const initialEmployees: Employee[] = [
    { id: 1, name: 'Ahmad Yani', phone: '081234567890', division: 'Backend', position: 'Backend Senior', image: 'https://placehold.co/40x40/f87171/ffffff?text=A' },
    { id: 2, name: 'Budi Santoso', phone: '081234567891', division: 'Mobile Apps', position: 'Senior Mobile Developer', image: 'https://placehold.co/40x40/facc15/ffffff?text=B' },
    { id: 3, name: 'Citra Lestari', phone: '081234567892', division: 'Full Stack', position: 'Full Stack Developer', image: 'https://placehold.co/40x40/4ade80/ffffff?text=C' },
    { id: 4, name: 'Dewi Anggraini', phone: '081234567893', division: 'UI/UX Designer', position: 'Senior UI/UX', image: 'https://placehold.co/40x40/60a5fa/ffffff?text=D' },
    { id: 5, name: 'Eka Prasetya', phone: '081234567894', division: 'QA', position: 'QA Engineer', image: 'https://placehold.co/40x40/f472b6/ffffff?text=E' },
    { id: 6, name: 'Fajar Nugraha', phone: '081234567895', division: 'Frontend', position: 'Frontend Developer', image: 'https://placehold.co/40x40/a78bfa/ffffff?text=F' },
    { id: 7, name: 'Agus Salim', phone: '081234567896', division: 'Backend', position: 'Junior Backend', image: 'https://placehold.co/40x40/fb923c/ffffff?text=A' },
];

const divisions = ["Semua Divisi", "Mobile Apps", "QA", "Full Stack", "Backend", "Frontend", "UI/UX Designer"];
const ITEMS_PER_PAGE = 5;

// --- Komponen Ikon ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;

// --- [BARU] Komponen Paginasi Kustom ---
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex justify-center items-center gap-2 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-slate-200 dark:bg-slate-700 disabled:opacity-50"
            >
                Previous
            </button>
            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={`px-3 py-1 rounded-md ${currentPage === number ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}
                >
                    {number}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-slate-200 dark:bg-slate-700 disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
};


// --- Komponen Halaman Utama ---
const EmployeeDataPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State untuk semua data pegawai dari localStorage
  const [employees, setEmployees] = useState<Employee[]>([]);
  // State untuk modal konfirmasi hapus
  const [modalState, setModalState] = useState({ isOpen: false, employeeId: null });

  // [AUTH GUARD] Melindungi halaman
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  // [CRUD] Inisialisasi dan memuat data dari localStorage
  useEffect(() => {
    const storedEmployees = localStorage.getItem("employees");
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    } else {
      // Jika localStorage kosong, inisialisasi dengan data awal
      localStorage.setItem("employees", JSON.stringify(initialEmployees));
      setEmployees(initialEmployees);
    }
  }, []);

  // [STATE PERSISTENCE] Mendapatkan state dari query string URL
  const searchQuery = searchParams.get('q') || '';
  const selectedDivision = searchParams.get('division') || 'Semua Divisi';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // [SEARCH & FILTER] Logika untuk memfilter data
  const filteredEmployees = useMemo(() => {
    return employees
      .filter(emp => emp.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter(emp => selectedDivision === 'Semua Divisi' || emp.division === selectedDivision);
  }, [employees, searchQuery, selectedDivision]);

  // [PAGINATION] Logika untuk paginasi
  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const paginatedEmployees = useMemo(() => {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      return filteredEmployees.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEmployees, currentPage]);


  // Handler untuk mengubah query string di URL
  const handleFilterChange = (key, value) => {
    setSearchParams(prev => {
        // Jika filter diubah, selalu kembali ke halaman 1
        if (key !== 'page') {
            prev.set('page', '1');
        }
        if (value) {
            prev.set(key, value);
        } else {
            prev.delete(key);
        }
        return prev;
    });
  };

  // [CRUD] Handler untuk menghapus pegawai
  const handleDelete = (id: number) => {
    const updatedEmployees = employees.filter(emp => emp.id !== id);
    setEmployees(updatedEmployees);
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
    toast.success("Pegawai berhasil dihapus!");
    setModalState({ isOpen: false, employeeId: null });
    // Jika halaman menjadi kosong setelah hapus, kembali ke halaman sebelumnya
    if (paginatedEmployees.length === 1 && currentPage > 1) {
        handleFilterChange('page', currentPage - 1);
    }
  };

  const openDeleteModal = (id: number) => {
    setModalState({ isOpen: true, employeeId: id });
  };

  const closeDeleteModal = () => {
    setModalState({ isOpen: false, employeeId: null });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Modal 
        isOpen={modalState.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => handleDelete(modalState.employeeId)}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus data pegawai ini?"
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Data Pegawai</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola semua data Pegawai di Aksamedia</p>
        </div>
      </div>

      {/* Kontrol dan Filter */}
      <div className="bg-white dark:bg-slate-800/50 p-4 rounded-xl mb-6 shadow-md border border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><SearchIcon /></span>
            <input 
              type="text"
              placeholder="Cari berdasarkan nama..."
              value={searchQuery}
              onChange={(e) => handleFilterChange('q', e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg p-2 pl-10 focus:ring-2 focus:ring-indigo-500 focus:outline-none border border-slate-300 dark:border-slate-600"
            />
          </div>
          
          <select 
            value={selectedDivision}
            onChange={(e) => handleFilterChange('division', e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none border border-slate-300 dark:border-slate-600"
          >
            {divisions.map(div => <option key={div} value={div}>{div}</option>)}
          </select>

          <Link to="/create/user" className="w-full md:w-auto md:justify-self-end bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
            <PlusIcon />
            Tambah Pegawai
          </Link>
        </div>
      </div>

      {/* Tabel Data Pegawai */}
      <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-md overflow-x-auto border border-slate-200 dark:border-slate-700">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 uppercase text-xs tracking-wider">Nama Pegawai</th>
              <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 uppercase text-xs tracking-wider">No Telepon</th>
              <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 uppercase text-xs tracking-wider">Divisi</th>
              <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 uppercase text-xs tracking-wider">Jabatan</th>
              <th className="p-4 font-semibold text-slate-600 dark:text-slate-300 uppercase text-xs tracking-wider text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {paginatedEmployees.length > 0 ? paginatedEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={emp.image} alt={emp.name} className="w-10 h-10 rounded-full object-cover" />
                    <span className="font-medium text-slate-900 dark:text-white">{emp.name}</span>
                  </td>
                  <td className="p-4 text-slate-500 dark:text-slate-300">{emp.phone}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-300">{emp.division}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-300">{emp.position}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Link to={`/update/user/${emp.id}`} className="p-2 text-slate-400 hover:text-yellow-500 transition-colors"><EditIcon /></Link>
                      <button onClick={() => openDeleteModal(emp.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><TrashIcon /></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={5} className="text-center p-8 text-slate-500 dark:text-slate-400">
                        Tidak ada data pegawai yang ditemukan.
                    </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
      
      {/* Paginasi */}
      {totalPages > 1 && (
        <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => handleFilterChange('page', page)}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 pt-8 pb-6 border-t border-slate-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
                <img src="/logoaksamedia.png" alt="Logo Aksamedia" className="h-6 w-auto opacity-70" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    &copy; {new Date().getFullYear()} Aksamedia. All Rights Reserved.
                </p>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Tentang Kami</a>
                <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Kontak</a>
                <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Kebijakan Privasi</a>
            </div>
        </div>
    </footer>
    </div>
  );
};

export default EmployeeDataPage;
