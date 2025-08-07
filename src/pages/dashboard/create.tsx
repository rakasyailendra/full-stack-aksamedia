import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useAuthGuard } from "../../hooks/useAuthGuard";

// --- Tipe Data ---
interface Employee {
  id: number;
  name: string;
  phone: string;
  division: string;
  position: string;
  image: string;
}

// --- Skema Validasi Zod ---
const employeeFormSchema = z.object({
  name: z.string().min(3, "Nama lengkap minimal 3 karakter."),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit.").regex(/^\d+$/, "Hanya boleh angka."),
  division: z.string().min(1, "Divisi wajib dipilih."),
  position: z.string().min(3, "Jabatan minimal 3 karakter."),
  image: z.string().url("URL gambar tidak valid.").optional().or(z.literal('')),
});

type EmployeeFormData = z.infer<typeof employeeFormSchema>;

// --- Opsi Divisi ---
const availableDivisions = ["Mobile Apps", "QA", "Full Stack", "Backend", "Frontend", "UI/UX Designer"];

const CreateEmployeePage = () => {
  useAuthGuard(); // Melindungi halaman
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = 
    useForm<EmployeeFormData>({
      resolver: zodResolver(employeeFormSchema),
      defaultValues: { name: "", phone: "", division: "", position: "", image: "" }
    });

  // --- Fungsi untuk menyimpan pegawai baru ke localStorage ---
  const saveNewEmployee = (data: EmployeeFormData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedData = localStorage.getItem("employees");
        const employees: Employee[] = storedData ? JSON.parse(storedData) : [];
        
        // Membuat ID baru yang unik
        const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
        
        // Membuat URL gambar placeholder dari inisial nama
        const initial = data.name.charAt(0).toUpperCase();
        const imageUrl = data.image || `https://placehold.co/40x40/6366f1/ffffff?text=${initial}`;

        const newEmployee: Employee = {
          id: newId,
          ...data,
          image: imageUrl,
        };

        const updatedEmployees = [...employees, newEmployee];
        localStorage.setItem("employees", JSON.stringify(updatedEmployees));
        resolve("Pegawai baru berhasil ditambahkan!");
      }, 1000); // Simulasi delay
    });
  };

  // --- Handler saat form disubmit ---
  const onFormSubmit: SubmitHandler<EmployeeFormData> = (values) => {
    const creationPromise = saveNewEmployee(values);

    toast.promise(creationPromise, {
      loading: "Menyimpan data...",
      success: (message) => `${message}`,
      error: "Gagal menyimpan data.",
    });

    creationPromise.then(() => {
      setTimeout(() => navigate("/data-karyawan"), 1500);
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-md p-6 sm:p-8 border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold mb-1 text-slate-900 dark:text-white">Tambah Pegawai Baru</h2>
            <p className="mb-6 text-slate-500 dark:text-slate-400">Isi formulir di bawah untuk membuat profil pegawai baru.</p>
            
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Nama Lengkap</label>
                <input id="name" {...register("name")} className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none border border-slate-300 dark:border-slate-600" placeholder="Contoh: Budi Setiawan"/>
                {errors.name && <p className="text-xs text-red-500 mt-2">{errors.name.message}</p>}
              </div>
              
              <div>
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">No. Telepon</label>
                <input id="phone" {...register("phone")} className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none border border-slate-300 dark:border-slate-600" placeholder="Contoh: 081234567890"/>
                {errors.phone && <p className="text-xs text-red-500 mt-2">{errors.phone.message}</p>}
              </div>

              <div>
                <label htmlFor="division" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Divisi</label>
                <select id="division" {...register("division")} className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none border border-slate-300 dark:border-slate-600">
                  <option value="">Pilih Divisi</option>
                  {availableDivisions.map(div => (
                    <option key={div} value={div}>{div}</option>
                  ))}
                </select>
                {errors.division && <p className="text-xs text-red-500 mt-2">{errors.division.message}</p>}
              </div>

              <div>
                <label htmlFor="position" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Jabatan</label>
                <input id="position" {...register("position")} className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none border border-slate-300 dark:border-slate-600" placeholder="Contoh: Frontend Developer"/>
                {errors.position && <p className="text-xs text-red-500 mt-2">{errors.position.message}</p>}
              </div>
              
              <div>
                <label htmlFor="image" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">URL Gambar (Opsional)</label>
                <input id="image" {...register("image")} className="w-full bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none border border-slate-300 dark:border-slate-600" placeholder="https://..."/>
                {errors.image && <p className="text-xs text-red-500 mt-2">{errors.image.message}</p>}
              </div>

              <div className="pt-4 flex items-center justify-end gap-4">
                <Link to="/data-karyawan" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:underline">
                    Batal
                </Link>
                <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white rounded-lg px-5 py-2.5 hover:bg-indigo-700 disabled:opacity-50 font-semibold transition-colors">
                  {isSubmitting ? "Menyimpan..." : "Simpan Pegawai"}
                </button>
              </div>
            </form>
          </div>
        </div>
    </div>
  );
};

export default CreateEmployeePage;
