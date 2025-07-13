import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuthRedirect } from "../../hooks/useAuthRedirect";


const authSchema = z.object({
  username: z.string().min(5, "Username setidaknya butuh 5 karakter."),
  password: z.string().min(1, "Password tidak boleh kosong."),
});

const Login = () => {
  useAuthRedirect();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: "Admin",
      password: "admin",
    },
  });

  const navigate = useNavigate();

  const authenticateUser = async (values: z.infer<typeof authSchema>) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (values.username === "Admin" && values.password === "admin") {
      localStorage.setItem("activeUser", values.username);
      return true;
    }
    throw new Error("Kredensial tidak valid");
  };

  const onLoginSubmit = async (values: z.infer<typeof authSchema>) => {
    try {
      await toast.promise(authenticateUser(values), {
        loading: "Mencoba masuk...",
        success: "Login berhasil! Mengarahkan anda...",
        error: "Username atau Password salah!",
      });
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      // Error sudah ditangani oleh toast.promise
    }
  };

  return (
    <main className="h-screen w-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md">
        {/* --- Awal Perubahan: Teks judul diganti --- */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Selamat Datang
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Silakan login untuk melanjutkan
          </p>
        </div>
        {/* --- Akhir Perubahan --- */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-8 shadow-lg bg-white dark:bg-gray-900">
          <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-300"
              >
                Username
              </label>
              <input
                id="username"
                {...register("username")}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                placeholder="Admin"
                required
              />
              {errors.username?.message && (
                <p className="text-xs text-red-500 mt-2">
                  {errors.username?.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password")}
                className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                placeholder="••••••••"
                required
              />
              {errors.password?.message && (
                <p className="text-xs text-red-500 mt-2">
                  {errors.password?.message}
                </p>
              )}
            </div>
            <div className="pt-2 text-right">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-indigo-600 text-white rounded-lg px-6 py-2.5 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {isSubmitting ? "Loading..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;