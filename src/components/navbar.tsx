import { Link, NavLink } from "react-router-dom";
import Container from "./Container";
import Dropdown from "./dropdown";
import DarkMode from "./dark-mode";

const Navbar = () => {
  // Style untuk link yang aktif
  const activeStyle = {
    color: '#4f46e5', // Warna indigo untuk teks pada tema terang
    fontWeight: '600',
    backgroundColor: 'rgba(238, 242, 255, 1)' // Warna latar indigo yang lebih terang
  };
  
  const activeStyleDark = {
    color: 'white',
    fontWeight: '600',
    backgroundColor: 'rgba(79, 70, 229, 0.5)' // Warna indigo dengan transparansi untuk tema gelap
  };

  return (
    <header className="w-full z-20 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <Container>
        <div className="flex justify-between items-center h-16">
          {/* Bagian Kiri: Logo, Nama, dan Navigasi */}
          <div className="flex items-center gap-8">
            {/* Logo dan Nama Brand */}
            <Link to="/" className="flex items-center gap-3">
               <img
                src="/logoaksamedia.png"
                alt="Logo Aksamedia"
                className="h-9 w-9 rounded-full object-cover border-2 border-indigo-500"
              />
              <span className="text-gray-800 dark:text-white font-bold text-xl hidden sm:inline">
                Aksamedia Admin
              </span>
            </Link>

            {/* Link Navigasi */}
            <nav className="hidden md:flex items-center gap-2">
              <NavLink 
                to="/" 
                end // 'end' prop penting agar tidak aktif saat di sub-route
                style={({ isActive }) => {
                    const isDark = document.documentElement.classList.contains('dark');
                    return isActive ? (isDark ? activeStyleDark : activeStyle) : undefined;
                }}
                className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/data-karyawan" 
                style={({ isActive }) => {
                    const isDark = document.documentElement.classList.contains('dark');
                    return isActive ? (isDark ? activeStyleDark : activeStyle) : undefined;
                }}
                className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Data Pegawai
              </NavLink>
            </nav>
          </div>

          {/* Bagian Kanan: Aksi dan Profil */}
          <div className="flex items-center gap-4">
            <DarkMode />
            <div className="flex items-center gap-3">
                
                <Dropdown />
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Navbar;
