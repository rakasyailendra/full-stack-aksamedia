import React, { useState, useEffect, useMemo } from 'react';
// Mengganti react-router-dom dengan placeholder karena tidak tersedia di lingkungan ini
// import { Link, useNavigate } from 'react-router-dom'; 
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Briefcase, UserPlus, Zap, Plus, Settings, Search, CheckCircle, ArrowRight, Sun, Moon } from 'lucide-react';

// --- [SEMPURNA] Komponen Ikon Lucide yang Elegan ---
// Menggunakan ikon dari pustaka 'lucide-react' untuk konsistensi dan kualitas.
const icons = {
  tim: <Users size={24} />,
  divisi: <Briefcase size={24} />,
  rekrutmen: <UserPlus size={24} />,
  uptime: <Zap size={24} />,
  plus: <Plus size={16} />,
  pengaturan: <Settings size={16} />,
  cari: <Search size={18} />,
  check: <CheckCircle size={16} />,
  lihatSemua: <ArrowRight size={14} />,
};

// --- [SEMPURNA] Data Dummy & Fungsi Helper ---
const dataPegawaiAwal = [
    { id: 1, name: 'Ahmad Yani', role: 'Backend Developer', phone: '081234567890', initial: 'A', color: 'bg-sky-500' },
    { id: 2, name: 'Budi Santoso', role: 'Mobile Developer', phone: '081234567891', initial: 'B', color: 'bg-emerald-500' },
    { id: 3, name: 'Citra Lestari', role: 'Full Stack Developer', phone: '081234567892', initial: 'C', color: 'bg-violet-500' },
    { id: 4, name: 'Dewi Anggraini', role: 'UI/UX Designer', phone: '081234567893', initial: 'D', color: 'bg-rose-500' },
    { id: 5, name: 'Eka Prasetya', role: 'DevOps Engineer', phone: '081234567894', initial: 'E', color: 'bg-amber-500' },
];

const dataChart = [
  { name: 'Jan', Aktivitas: 2400 },
  { name: 'Feb', Aktivitas: 1398 },
  { name: 'Mar', Aktivitas: 9800 },
  { name: 'Apr', Aktivitas: 3908 },
  { name: 'Mei', Aktivitas: 4800 },
  { name: 'Jun', Aktivitas: 3800 },
  { name: 'Jul', Aktivitas: 4300 },
];

const dapatkanSapaan = () => {
    const jam = new Date().getHours();
    if (jam < 4) return "Selamat Malam";
    if (jam < 11) return "Selamat Pagi";
    if (jam < 15) return "Selamat Siang";
    if (jam < 19) return "Selamat Sore";
    return "Selamat Malam";
}

// --- [SEMPURNA] Komponen Skeleton yang Lebih Detail ---
const SkeletonLoader = () => (
    <div className="bg-slate-50 dark:bg-slate-950 font-sans p-4 sm:p-6 lg:p-8 animate-pulse">
        <div className="flex justify-between items-center mb-8">
            <div className="h-10 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            <div className="h-10 w-1/4 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => <div key={i} className="h-36 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
            <div className="lg:col-span-1 h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
    </div>
);

// --- [SEMPURNA] Komponen Kartu Statistik dengan Efek Halus ---
const KartuStatistik = ({ ikon, label, nilai, detail, gradasi }) => (
    <motion.div
        className={`relative text-white p-6 rounded-2xl overflow-hidden shadow-lg ${gradasi}`}
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
        }}
        whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
    >
        <div className="absolute -top-4 -right-4 text-white/10">{React.cloneElement(ikon, { size: 80 })}</div>
        <div className="relative z-10">
            <div className="flex justify-between items-start">
                <p className="font-medium text-white/90">{label}</p>
                <div className="text-white/80">{ikon}</div>
            </div>
            <motion.p layout className="text-4xl font-bold mt-3">{nilai}</motion.p>
            <p className="text-sm text-white/70 mt-1">{detail}</p>
        </div>
    </motion.div>
);

// --- [BARU] Komponen Header Halaman yang Canggih ---
const PageHeader = ({ namaPengguna, darkMode, toggleDarkMode }) => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{dapatkanSapaan()}, {namaPengguna}!</h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Selamat datang kembali di pusat kendali SDM Anda.</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
             <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    {icons.cari}
                </div>
                <input
                    type="text"
                    placeholder="Cari pegawai..."
                    className="w-full bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
            </div>
            <button onClick={toggleDarkMode} className="p-2 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </div>
    </div>
);

// --- [BARU] Komponen Chart Aktivitas ---
const AktivitasChart = () => (
    <div className="bg-white dark:bg-slate-800/50 p-4 sm:p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Aktivitas Perekrutan</h2>
        <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataChart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="name" stroke="currentColor" className="text-xs text-slate-500 dark:text-slate-400" />
                    <YAxis stroke="currentColor" className="text-xs text-slate-500 dark:text-slate-400" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            backdropFilter: 'blur(5px)',
                            border: '1px solid #ddd',
                            borderRadius: '0.75rem',
                            color: '#333'
                        }}
                    />
                    <Area type="monotone" dataKey="Aktivitas" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
);

// --- [SEMPURNA] Komponen Tabel Pegawai dengan Animasi ---
const TabelPegawai = ({ data }) => {
    const tableVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };
    const rowVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="bg-white dark:bg-slate-800/50 p-4 sm:p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Pegawai Baru</h2>
                <a href="#" className="flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    Lihat Semua {icons.lihatSemua}
                </a>
            </div>
            <div className="overflow-x-auto">
                <motion.table variants={tableVariants} initial="hidden" animate="visible" className="w-full text-left">
                    <thead className="border-b-2 border-slate-100 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
                        <tr>
                            <th className="p-3 font-semibold">Pegawai</th>
                            <th className="p-3 font-semibold hidden md:table-cell">Jabatan</th>
                            <th className="p-3 font-semibold text-right">Kontak</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((p) => (
                            <motion.tr key={p.id} variants={rowVariants} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-200 border-b border-slate-100 dark:border-slate-800 last:border-b-0">
                                <td className="p-3">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white text-lg ${p.color}`}>{p.initial}</div>
                                        <div>
                                            <p className="font-semibold text-slate-800 dark:text-slate-100">{p.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 md:hidden">{p.role}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3 align-middle text-slate-600 dark:text-slate-300 hidden md:table-cell">{p.role}</td>
                                <td className="p-3 align-middle text-right text-sm text-slate-600 dark:text-slate-300 font-mono">{p.phone}</td>
                            </motion.tr>
                        ))}
                    </tbody>
                </motion.table>
            </div>
        </div>
    );
};


// --- [SEMPURNA] Komponen Utama Dasbor ---
const App = () => {
    // const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const namaPenggunaAktif = "Aksamedia";

    const [stats, setStats] = useState({
        pegawai: 5,
        divisi: 10,
        rekrutmen: 2,
        uptime: '99.9'
    });

    useEffect(() => {
        // Simulasi pengecekan login
        // const sudahLogin = localStorage.getItem("isLoggedIn");
        // if (sudahLogin !== "true") {
        //     navigate("/login");
        //     return;
        // }

        // Simulasi loading data
        const timer = setTimeout(() => setLoading(false), 1500);

        // [REAL-TIME] Simulasi data berubah
        const interval = setInterval(() => {
            setStats(prev => ({
                ...prev,
                uptime: (99.9 + Math.random() * 0.09).toFixed(2),
                pegawai: Math.random() > 0.95 ? prev.pegawai + 1 : prev.pegawai,
            }));
        }, 5000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []); // Dependensi kosong agar hanya berjalan sekali

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    if (loading) {
        return <SkeletonLoader />;
    }
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="bg-slate-50 dark:bg-slate-950 font-['Inter',_sans-serif] min-h-screen transition-colors duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                    <PageHeader namaPengguna={namaPenggunaAktif} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

                    <motion.div
                        className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <KartuStatistik ikon={icons.tim} label="Total Pegawai" nilai={stats.pegawai} detail="Pegawai aktif" gradasi="bg-gradient-to-br from-sky-500 to-indigo-600" />
                        <KartuStatistik ikon={icons.divisi} label="Total Divisi" nilai={stats.divisi} detail="Departemen" gradasi="bg-gradient-to-br from-emerald-500 to-teal-600" />
                        <KartuStatistik ikon={icons.rekrutmen} label="Rekrutmen" nilai={stats.rekrutmen} detail="Posisi terbuka" gradasi="bg-gradient-to-br from-amber-500 to-orange-600" />
                        <KartuStatistik ikon={icons.uptime} label="Uptime" nilai={`${stats.uptime}%`} detail="Sistem stabil" gradasi="bg-gradient-to-br from-violet-500 to-purple-600" />
                    </motion.div>

                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Kolom Konten Utama (lebih besar) */}
                        <main className="lg:col-span-2 space-y-8">
                            <AktivitasChart />
                            <TabelPegawai data={dataPegawaiAwal} />
                        </main>

                        {/* Kolom Sidebar */}
                        <aside className="lg:col-span-1 space-y-8">
                             <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
                                <h3 className="font-semibold text-lg text-slate-800 dark:text-white mb-4">Aksi Cepat</h3>
                                <div className="space-y-3">
                                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-indigo-400/50 dark:shadow-indigo-900/50 shadow-lg">
                                        {icons.plus} Tambah Pegawai
                                    </motion.button>
                                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                                        {icons.pengaturan} Kelola Divisi
                                    </motion.button>
                                </div>
                            </div>
                             <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700">
                                <h3 className="font-semibold text-lg text-slate-800 dark:text-white mb-4">Status Sistem</h3>
                                <ul className="space-y-4 text-sm">
                                    <li className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                                        <span className="flex items-center gap-2">{React.cloneElement(icons.check, { className: "text-green-500" })} API Utama</span>
                                        <span className="font-semibold text-green-500">Operasional</span>
                                    </li>
                                     <li className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                                        <span className="flex items-center gap-2">{React.cloneElement(icons.check, { className: "text-green-500" })} Database</span>
                                        <span className="font-semibold text-green-500">Tersambung</span>
                                    </li>
                                     <li className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                                        <span className="flex items-center gap-2">{React.cloneElement(icons.check, { className: "text-slate-400" })} Backup Terakhir</span>
                                        <span className="font-semibold text-slate-500 dark:text-slate-400">1 jam lalu</span>
                                    </li>
                                </ul>
                            </div>
                        </aside>
                    </div>

                    <footer className="text-center mt-16 pt-8 pb-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            © {new Date().getFullYear()} Aksamedia Dashboard. Dibangun dengan ❤️
                        </p>
                    </footer>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default App;

