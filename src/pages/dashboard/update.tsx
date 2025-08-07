import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/navbar";
import Container from "../../components/Container";
import { useAuthGuard } from "../../hooks/useAuthGuard";
import axios from "axios";

// --- Tipe Data ---
interface Division {
    id: string;
    name: string;
}

const employeeFormSchema = z.object({
  name: z.string().min(3, "Nama lengkap minimal 3 karakter."),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit."),
  position: z.string().min(3, "Posisi minimal 3 karakter."),
  division_id: z.string().min(1, "Divisi wajib dipilih."),
  image: z.any().optional(),
});

type EmployeeFormData = z.infer<typeof employeeFormSchema>;

const UpdateEmployeePage = () => {
  useAuthGuard();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = 
    useForm<EmployeeFormData>({
      resolver: zodResolver(employeeFormSchema),
    });

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const authToken = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchInitialData = async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const [employeeRes, divisionsRes] = await Promise.all([
                axios.get(`${API_URL}/api/employees/${id}`, { headers: { Authorization: `Bearer ${authToken}` } }),
                axios.get(`${API_URL}/api/divisions`, { headers: { Authorization: `Bearer ${authToken}` } })
            ]);
            
            const employeeData = employeeRes.data.data;
            // Memastikan division_id adalah string
            const transformedData = {
                ...employeeData,
                division_id: employeeData.division?.id?.toString() || ''
            };
            reset(transformedData);
            setDivisions(divisionsRes.data.data);
        } catch (error) {
            toast.error("Gagal memuat data untuk diedit.");
            navigate('/data-karyawan');
        } finally {
            setIsLoading(false);
        }
    };
    fetchInitialData();
  }, [id, reset, navigate, API_URL, authToken]);

  const onUpdateSubmit: SubmitHandler<EmployeeFormData> = async (data) => {
    if (!id) return;
    
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('phone', data.phone);
    formData.append('position', data.position);
    formData.append('division_id', data.division_id);
    if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
    }
    formData.append('_method', 'PUT'); // Method spoofing

    const toastId = toast.loading("Menyimpan perubahan...");
    try {
        await axios.post(`${API_URL}/api/employees/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        toast.success("Data pegawai berhasil diperbarui.", { id: toastId });
        setTimeout(() => navigate("/data-karyawan"), 1500);
    } catch (error) {
        toast.error("Gagal menyimpan perubahan.", { id: toastId });
    }
  };

  if (isLoading) {
      return (
        <>
            <Navbar />
            <Container>
                <div className="text-center py-20">Memuat data...</div>
            </Container>
        </>
      );
  }

  return (
    <>
      <Navbar />
      <Container>
        <div className="max-w-2xl mx-auto pt-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">Edit Data Pegawai</h2>
            <p className="mb-6 text-gray-500 dark:text-gray-400">Perbarui informasi pegawai di bawah ini.</p>
            <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium">Nama Lengkap</label>
                <input id="name" {...register("name")} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5" placeholder="e.g. Budi Sanjaya"/>
                {errors.name && <p className="text-xs text-red-500 mt-2">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block mb-2 text-sm font-medium">No. Telepon</label>
                <input id="phone" {...register("phone")} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5" placeholder="e.g. 08123456789"/>
                {errors.phone && <p className="text-xs text-red-500 mt-2">{errors.phone.message}</p>}
              </div>
              <div>
                <label htmlFor="position" className="block mb-2 text-sm font-medium">Jabatan</label>
                <input id="position" {...register("position")} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5" placeholder="e.g. Backend Developer"/>
                {errors.position && <p className="text-xs text-red-500 mt-2">{errors.position.message}</p>}
              </div>
              <div>
                <label htmlFor="division_id" className="block mb-2 text-sm font-medium">Divisi</label>
                <select id="division_id" {...register("division_id")} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5">
                  <option value="">Pilih Divisi</option>
                  {divisions.map(div => (
                    <option key={div.id} value={div.id}>{div.name}</option>
                  ))}
                </select>
                {errors.division_id && <p className="text-xs text-red-500 mt-2">{errors.division_id.message}</p>}
              </div>
               <div>
                <label htmlFor="image" className="block mb-2 text-sm font-medium">Foto Profil (Opsional)</label>
                <input type="file" id="image" {...register("image")} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
              </div>
              <div className="pt-4 text-right">
                <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white rounded-lg px-5 py-2.5 hover:bg-indigo-700 disabled:opacity-50">
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </>
  );
};

export default UpdateEmployeePage;
