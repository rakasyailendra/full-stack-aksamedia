import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiUser } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

const Dropdown = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const logoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        localStorage.clear();
        resolve(true);
      }, 1000);
    });

    await toast.promise(logoutPromise, {
      loading: "Logging out...",
      success: "You have been logged out!",
      error: "Logout failed!",
    });

    navigate("/login");
  };

  useEffect(() => {
    const activeUser = localStorage.getItem("activeUser");
    setCurrentUser(activeUser);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!isMenuOpen)}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <FaUserCircle size={28} />
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-xl z-20 border dark:border-gray-700">
          <div className="p-2" role="menu" aria-orientation="vertical">
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 mb-1">
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Signed in as</p>
              <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">{currentUser}</p>
            </div>
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              role="menuitem"
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-left rounded-md text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <FiUser />
              <span>Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              role="menuitem"
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-left rounded-md text-red-600 hover:bg-red-100 dark:hover:bg-gray-700"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;