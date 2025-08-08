// File: src/pages/dashboard/index.tsx (Versi Data Dummy)

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Briefcase, UserPlus, Zap, Plus, Settings, Search, ArrowRight } from 'lucide-react';

// --- Tipe Data ---
interface StatCardProps {
  ikon: React.ReactNode;
  label: string;
  nilai: string | number;
  detail: string;
  gradasi: string;
}

interface HeaderProps {
    namaPengguna: string | null;
}

interface Employee {
    id: string;
    name: string;
    role: string;
    image: string;
}

interface RecentEmployeeListProps {
    data: Employee[];
}

// --- Komponen Ikon ---
const icons = {
  tim: <Users size={24} />,
  divisi: <Briefcase size={24} />,
  rekrutmen: <UserPlus size={24} />,
  uptime: <Zap size={24} />,
  plus: <Plus size={16} />,
  pengaturan: <Settings size={16} />,
  cari: <Search size={18} />,
  lihatSemua: <ArrowRight size={14} />,
};

// --- Data Dummy & Fungsi Helper ---
const dataPegawaiAwal: Employee[] = [
    { id: '1', name: 'Ahmad Yani', role: 'Backend Developer', image: 'https://placehold.co/40x40/f87171/ffffff?text=A' },
    { id: '2', name: 'Siti Mariah', role: 'Frontend Developer', image: 'https://placehold.co/40x40/facc15/ffffff?text=S' },
    { id: '3', name: 'Budi Santoso', role: 'UI/UX Designer', image: 'https://placehold.co/40x40/4ade80/ffffff?text=B' },
];

const dataGrafik = [
  { name: 'Jan', Karyawan: 30 },
  { name: 'Feb', Karyawan: 35 },
  { name: 'Mar', Karyawan: 45 },
  { name: 'Apr', Karyawan: 48 },
  { name: 'Mei', Karyawan: 50 },
  { name: 'Jun', Karyawan: 55 },
  { name: 'Jul', Karyawan: 60 },
];

// --- Komponen UI ---
const StatCard = ({ ikon, label, nilai, detail, gradasi }: StatCardProps) => (
    <div className={`p-6 rounded-2xl text-white shadow-lg transition-transform transform hover:-translate-y-1 ${gradasi}`}>
        <div className="flex justify-between items-start">
            <div className="bg-white/20 p-3 rounded-xl">{ikon}</div>
        </div>
        <p className="text-3xl font-bold mt-4">{nilai}</p>
        <p className="text-sm opacity-80">{label}</p>
        <p className="text-xs opacity-60 mt-2">{detail}</p>
    </div>
);

const Header = ({ namaPengguna }: HeaderProps) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Selamat Datang, {namaPengguna || "Admin"}!</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Ini adalah ringkasan aktivitas perusahaan Anda.</p>
        </div>
        <div className="flex items-center gap-3">
            <Link to="/data-pegawai" className="flex items-center gap-2 text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                {icons.cari}
                <span>Cari Pegawai...</span>
            </Link>
            <Link to="/create/user" className="flex items-center gap-2 text-sm font-semibold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md">
                {icons.plus}
                <span>Tambah Pegawai</span>
            </Link>
        </div>
    </div>
);

const RecentEmployeeList = ({ data }: RecentEmployeeListProps) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Pegawai Baru</h3>
            <Link to="/data-pegawai" className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                Lihat Semua {icons.lihatSemua}
            </Link>
        </div>
        <ul className="space-y-4">
            {data.map((p: Employee) => (
                <li key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                            <p className="font-semibold text-slate-700 dark:text-slate-200">{p.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{p.role}</p>
                        </div>
                    </div>
                    <Link to={`/update/user/${p.id}`} className="px-3 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">Lihat</Link>
                </li>
            ))}
        </ul>
    </div>
);


const DashboardPage = () => {
    const [namaPengguna, setNamaPengguna] = useState<string | null>(null);

    useEffect(() => {
        // Kita hanya mengambil nama dari localStorage, tidak ada panggilan API
        const user = localStorage.getItem('activeUser');
        setNamaPengguna(user);
    }, []);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Header namaPengguna={namaPengguna} />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard ikon={icons.tim} label="Total Pegawai" nilai="60" detail="+5 bulan ini" gradasi="bg-gradient-to-br from-indigo-500 to-blue-500" />
                        <StatCard ikon={icons.divisi} label="Total Divisi" nilai="8" detail="2 baru ditambahkan" gradasi="bg-gradient-to-br from-purple-500 to-pink-500" />
                        <StatCard ikon={icons.rekrutmen} label="Rekrutmen Baru" nilai="12" detail="Menunggu interview" gradasi="bg-gradient-to-br from-green-500 to-teal-500" />
                        <StatCard ikon={icons.uptime} label="Uptime Server" nilai="99.9%" detail="Semua sistem normal" gradasi="bg-gradient-to-br from-yellow-500 to-orange-500" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">Pertumbuhan Karyawan</h3>
                            <div style={{ width: '100%', height: 300 }}>
                                <ResponsiveContainer>
                                    <AreaChart data={dataGrafik} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                                        <XAxis dataKey="name" tick={{ fill: 'rgb(100 116 139)', fontSize: 12 }} />
                                        <YAxis tick={{ fill: 'rgb(100 116 139)', fontSize: 12 }} />
                                        <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: 'none', borderRadius: '0.5rem' }} />
                                        <Area type="monotone" dataKey="Karyawan" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <RecentEmployeeList data={dataPegawaiAwal} />
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default DashboardPage;