import { useEffect } from "react";
import Navbar from "../../components/navbar";
import Container from "../../components/Container";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

const profileSchema = z.object({
  name: z.string().min(5, "Nama lengkap Anda minimal 5 karakter."),
});

const Profile = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const navigate = useNavigate();

  const updateProfileName = (data: z.infer<typeof profileSchema>) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem("activeUser", data.name); 
        resolve("Nama profil berhasil diubah.");
      }, 1500);
    });
  };

  const onProfileSubmit = (values: z.infer<typeof profileSchema>) => {
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
    } else {
      navigate("/login");
    }
  }, [reset, navigate]);

  return (
    <main className="h-screen dark:bg-gray-950 dark:text-white">
      <Navbar />
      <Container>
        <div className="max-w-xl mx-auto pt-10">
          <h2 className="text-2xl font-bold mb-6">Ubah Nama Profil</h2>
          <form onSubmit={handleSubmit(onProfileSubmit)}>
            <div className="mb-5">
              <label htmlFor="name" className="block mb-2 text-sm font-medium">Nama Baru</label>
              <input id="name" {...register("name")} className="bg-gray-50 border border-gray-300 text-gray-900 dark:text-white bg-transparent text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5" placeholder="Masukkan nama lengkap baru Anda"/>
              {errors.name?.message && <p className="text-xs text-red-500 mt-2">{errors.name.message}</p>}
            </div>
            <div className="mb-5 text-right">
              <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white rounded-lg px-5 py-2 hover:bg-indigo-700 disabled:opacity-50">
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </Container>
    </main>
  );
};

export default Profile;