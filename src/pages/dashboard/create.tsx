import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Container from "../../components/Container";
import { useAuthGuard } from "../../hooks/useAuthGuard";

const userFormSchema = z.object({
  name: z.string().min(3, "Nama lengkap minimal 3 karakter."),
  company: z.string().min(3, "Nama perusahaan minimal 3 karakter."),
  role: z.string().min(1, "Posisi wajib dipilih."),
});

type UserFormData = z.infer<typeof userFormSchema>;

const availableRoles = [
  "Frontend Engineer", "UI/UX Designer", "Backend Specialist", "Product Manager",
  "DevOps Engineer", "QA Engineer", "Data Analyst", "Fullstack Developer",
  "Security Specialist", "Mobile Developer", "Cloud Engineer", "Scrum Master",
  "IT Support", "Business Analyst", "System Architect"
];

const CreateUser = () => {
  useAuthGuard();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = 
    useForm<UserFormData>({
      resolver: zodResolver(userFormSchema),
      defaultValues: { name: "", company: "", role: "" }
    });
  const navigate = useNavigate();

  const saveNewUser = (data: UserFormData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const storedData = localStorage.getItem("allUsersData");
        if (storedData) {
          const users = JSON.parse(storedData);
          const newUser = {
            id: users.length > 0 ? Math.max(...users.map((u: any) => u.id)) + 1 : 1,
            ...data,
          };
          const updatedUsers = [...users, newUser];
          localStorage.setItem("allUsersData", JSON.stringify(updatedUsers));
          resolve("Pengguna baru berhasil ditambahkan!");
        }
      }, 1500);
    });
  };

  const onFormSubmit: SubmitHandler<UserFormData> = (values) => {
    const creationPromise = saveNewUser(values);
    toast.promise(creationPromise, {
      loading: "Menyimpan data...",
      success: (message) => `${message}`,
      error: "Gagal menyimpan data.",
    });
    creationPromise.then(() => {
      setTimeout(() => navigate("/"), 2000);
    });
  };

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      <Navbar />
      <Container>
        <div className="max-w-2xl mx-auto pt-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">Add New User</h2>
            <p className="mb-6 text-gray-500 dark:text-gray-400">Fill the form below to create a new user profile.</p>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium">Nama Lengkap</label>
                <input id="name" {...register("name")} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5" placeholder="e.g. Budi Setiawan"/>
                {errors.name && <p className="text-xs text-red-500 mt-2">{errors.name.message}</p>}
              </div>
              <div>
                <label htmlFor="company" className="block mb-2 text-sm font-medium">Perusahaan</label>
                <input id="company" {...register("company")} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5" placeholder="e.g. Digital Agency"/>
                {errors.company && <p className="text-xs text-red-500 mt-2">{errors.company.message}</p>}
              </div>
              <div>
                <label htmlFor="role" className="block mb-2 text-sm font-medium">Posisi</label>
                <select id="role" {...register("role")} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5">
                  <option className="bg-white dark:bg-gray-800" value="">Pilih Posisi</option>
                  {availableRoles.map(role => (
                    <option key={role} value={role} className="bg-white dark:bg-gray-800">{role}</option>
                  ))}
                </select>
                {errors.role && <p className="text-xs text-red-500 mt-2">{errors.role.message}</p>}
              </div>
              <div className="pt-4 text-right">
                <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white rounded-lg px-5 py-2.5 hover:bg-indigo-700 disabled:opacity-50 font-semibold">
                  {isSubmitting ? "Saving..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </main>
  );
};

export default CreateUser;