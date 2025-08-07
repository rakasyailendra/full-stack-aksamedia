import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useEffect } from "react";

// Skema validasi menggunakan Zod
const authSchema = z.object({
  username: z.string().min(1, "Username tidak boleh kosong."),
  password: z.string().min(1, "Password tidak boleh kosong."),
});

// Tipe untuk data formulir, diambil dari skema Zod
type AuthFormValues = z.infer<typeof authSchema>;

// Komponen Ikon untuk input
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);


const LoginPage = () => {
  const navigate = useNavigate();

  // Logika untuk mengalihkan pengguna jika sudah login
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      navigate("/");
    }
  }, [navigate]);


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    // Menggunakan kredensial sesuai spesifikasi backend
    defaultValues: {
      username: "admin",
      password: "pastibisa",
    },
  });

  // Fungsi untuk mensimulasikan proses otentikasi
  const authenticateUser = async (values: AuthFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    // Pengecekan disesuaikan dengan spesifikasi backend
    if (values.username === "admin" && values.password === "pastibisa") {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("activeUser", "Admin Aksamedia");
      return true;
    }
    throw new Error("Kredensial tidak valid");
  };

  // Fungsi yang dijalankan saat form disubmit
  const onLoginSubmit = async (values: AuthFormValues) => {
    try {
      await toast.promise(authenticateUser(values), {
        loading: "Mencoba masuk...",
        success: "Login berhasil! Mengarahkan Anda...",
        error: "Username atau Password salah!",
      });
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen w-full flex bg-gray-100 dark:bg-gray-950">
      {/* Kolom Kiri - Branding (Terlihat di layar besar) */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-purple-800 dark:to-indigo-900 text-white p-12 transition-all duration-500">
        <div className="text-center">
            <img
                src="/profile.png"
                alt="Foto Profil"
                className="mx-auto h-32 w-32 rounded-full object-cover mb-6 border-4 border-white/20 shadow-xl"
            />
            <h1 className="text-4xl font-bold tracking-tight">Portal Dasbor Aksamedia</h1>
            <p className="mt-4 text-indigo-200 dark:text-purple-200 text-lg">Manajemen informasi dan data terpusat untuk Tim Aksamedia.</p>
        </div>
      </div>

      {/* Kolom Kanan - Form Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
             <img
                src="/logoaksamedia.png"
                alt="Logo Aksamedia"
                className="mx-auto h-20 w-auto mb-4"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center">
            Selamat Datang, Aksa Tim!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-center mb-8">
            Masukkan kredensial Anda untuk mengakses dasbor.
          </p>

          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-800">
            {/* Teks pemberitahuan kredensial diperbarui */}
            <div className="bg-indigo-50 dark:bg-gray-800 p-4 rounded-lg mb-6 border-l-4 border-indigo-500 dark:border-purple-500">
              <h4 className="font-semibold text-sm text-indigo-900 dark:text-purple-200 mb-1">Akses Demo</h4>
              <p className="text-xs text-indigo-800 dark:text-purple-300">
                Username: <code className="font-mono bg-indigo-100 dark:bg-gray-700 p-1 rounded">admin</code>
                <br />
                Password: <code className="font-mono bg-indigo-100 dark:bg-gray-700 p-1 rounded">pastibisa</code>
              </p>
            </div>
            
            <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-5">
              <div>
                <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-300">
                  Username
                </label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <UserIcon />
                    </span>
                    <input
                        id="username"
                        {...register("username")}
                        className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-indigo-500 dark:focus:ring-purple-500 focus:border-indigo-500 dark:focus:border-purple-500 block w-full p-2.5 pl-10"
                        placeholder="Masukkan username"
                    />
                </div>
                {errors.username && (
                  <p className="text-xs text-red-500 mt-2">{errors.username.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <LockIcon />
                    </span>
                    <input
                        type="password"
                        id="password"
                        {...register("password")}
                        className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-indigo-500 dark:focus:ring-purple-500 focus:border-indigo-500 dark:focus:border-purple-500 block w-full p-2.5 pl-10"
                        placeholder="••••••••"
                    />
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-2">{errors.password.message}</p>
                )}
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 dark:bg-purple-600 text-white rounded-lg px-6 py-3 hover:bg-indigo-700 dark:hover:bg-purple-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 dark:focus:ring-purple-500 disabled:opacity-60 disabled:cursor-not-allowed font-semibold transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  {isSubmitting ? "Memproses..." : "Login"}
                </button>
              </div>
            </form>
          </div>
           <p className="text-center text-xs text-gray-400 mt-8">
              &copy; {new Date().getFullYear()} Aksamedia. Seluruh hak cipta.
            </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
