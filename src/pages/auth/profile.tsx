import { useEffect } from "react";
import Navbar from "../../components/navbar";
import Container from "../../components/Container";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useAuthGuard } from "../../hooks/useAuthGuard";

const profileSchema = z.object({
  name: z.string().min(5, "Nama lengkap Anda minimal 5 karakter."),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile = () => {
  useAuthGuard();

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = 
    useForm<ProfileFormData>({
      resolver: zodResolver(profileSchema),
    });

  const navigate = useNavigate();

  const updateProfileName = (data: ProfileFormData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem("activeUser", data.name);
        resolve("Nama profil berhasil diubah.");
      }, 1500);
    });
  };

  const onProfileSubmit: SubmitHandler<ProfileFormData> = (values) => {
    const updatePromise = updateProfileName(values);
    toast.promise(updatePromise, {
      loading: "Menyimpan...",
      success: (message) => `${message}`,
      error: "Gagal menyimpan perubahan.",
    });

    updatePromise.then(() => {
      setTimeout(() => navigate("/"), 2000);
    });
  };

  useEffect(() => {
    const activeUser = localStorage.getItem("activeUser");
    if (activeUser) {
      reset({ name: activeUser });
    }
  }, [reset]);

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      <Navbar />
      <Container>
        <div className="max-w-2xl mx-auto pt-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">Ubah Nama Profil</h2>
            <p className="mb-6 text-gray-500 dark:text-gray-400">Update your profile name below.</p>
            <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium">Nama Baru</label>
                <input id="name" {...register("name")} className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5" placeholder="Masukkan nama lengkap baru Anda"/>
                {errors.name && <p className="text-xs text-red-500 mt-2">{errors.name.message}</p>}
              </div>
              <div className="pt-4 text-right">
                <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white rounded-lg px-5 py-2.5 hover:bg-indigo-700 disabled:opacity-50 font-semibold">
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </main>
  );
};

export default Profile;