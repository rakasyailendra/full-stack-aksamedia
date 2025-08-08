import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import Modal from "../../components/modal";
import { EditIcon, TrashIcon, PlusIcon, SearchIcon } from "../../components/icons";

// --- Tipe Data (sesuai spesifikasi API) ---
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

interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
}

// --- Tipe Props Komponen ---
interface PaginationControlsProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

// --- Komponen ---

const PaginationControls = ({ currentPage, totalPages, onPageChange }: PaginationControlsProps) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            currentPage === number
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

const EmployeeListPage = () => {
  useAuthGuard();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    name: searchParams.get("name") || "",
    division_id: searchParams.get("division_id") || "",
  });
  const [modalState, setModalState] = useState({ isOpen: false, employeeId: '' });

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const authToken = localStorage.getItem('authToken');

  const fetchEmployees = async (page = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        name: filters.name,
        division_id: filters.division_id,
      });
      
      const response = await axios.get(`${API_URL}/api/employees?${params.toString()}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setEmployees(response.data.data);
      setMeta(response.data.meta);
    } catch (error) {
      toast.error("Gagal memuat data pegawai.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDivisions = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/divisions`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        setDivisions(response.data.data);
    } catch (error) {
        toast.error("Gagal memuat data divisi.");
    }
  };

  useEffect(() => {
    const currentPage = Number(searchParams.get('page')) || 1;
    fetchEmployees(currentPage);
    fetchDivisions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleFilterChange = (key: 'name' | 'division_id', value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const newParams = new URLSearchParams();
    if (filters.name) newParams.set("name", filters.name);
    if (filters.division_id) newParams.set("division_id", filters.division_id);
    setSearchParams(newParams);
  };

  const openDeleteModal = (employeeId: string) => {
    setModalState({ isOpen: true, employeeId });
  };

  const closeDeleteModal = () => {
    setModalState({ isOpen: false, employeeId: '' });
  };

  const handleDelete = async () => {
    const toastId = toast.loading("Menghapus data...");
    try {
        await axios.delete(`${API_URL}/api/employees/${modalState.employeeId}`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        toast.success("Data pegawai berhasil dihapus.", { id: toastId });
        // SOLUSI: Beri nilai fallback 1 jika meta atau current_page tidak ada
        fetchEmployees(meta?.current_page || 1); 
    } catch (error) {
        toast.error("Gagal menghapus data.", { id: toastId });
    } finally {
        closeDeleteModal();
    }
  };

  // SOLUSI: Tambahkan tipe 'number' pada parameter page
  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Data Pegawai</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Kelola semua data pegawai di sini.</p>
        </div>
        <Link to="/create/user" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md">
          <PlusIcon />
          Tambah Pegawai
        </Link>
      </div>

      {/* Filter Section */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <SearchIcon />
            </div>
            <input
                type="text"
                placeholder="Cari nama pegawai..."
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                className="w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
            />
        </div>
        <select
            value={filters.division_id}
            onChange={(e) => handleFilterChange('division_id', e.target.value)}
            className="w-full sm:w-auto p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
        >
            <option value="">Semua Divisi</option>
            {divisions.map(division => (
                <option key={division.id} value={division.id}>{division.name}</option>
            ))}
        </select>
        <button onClick={applyFilters} className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
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
            {isLoading ? (
              <tr><td colSpan={5} className="text-center p-8">Memuat data...</td></tr>
            ) : employees.length > 0 ? (
              employees.map((employee) => (
                <tr key={employee.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                    <img src={employee.image ? `${API_URL}/storage/${employee.image.replace('public/', '')}` : 'https://placehold.co/40x40/cbd5e0/ffffff?text=E'} alt={employee.name} className="w-10 h-10 rounded-full object-cover" />
                    {employee.name}
                  </td>
                  <td className="px-6 py-4">{employee.phone}</td>
                  <td className="px-6 py-4">{employee.position}</td>
                  <td className="px-6 py-4">{employee.division?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Link to={`/update/user/${employee.id}`} className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"><EditIcon /></Link>
                      <button onClick={() => openDeleteModal(employee.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><TrashIcon /></button>
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
      
      {meta && meta.last_page > 1 && (
        <PaginationControls
          currentPage={meta.current_page}
          totalPages={meta.last_page}
          onPageChange={handlePageChange}
        />
      )}

      <Modal
        isOpen={modalState.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus data pegawai ini?"
      />
    </div>
  );
};

export default EmployeeListPage;