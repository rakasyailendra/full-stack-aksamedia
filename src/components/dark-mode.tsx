import { useState, useEffect } from "react";
import { FiMonitor, FiMoon, FiSun } from "react-icons/fi";

const DarkMode = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("colorTheme") || "system"
  );
  
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("colorTheme", theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleOsThemeChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("colorTheme") === "system") {
        document.documentElement.classList.toggle("dark", e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleOsThemeChange);
    return () => mediaQuery.removeEventListener("change", handleOsThemeChange);
  }, []);

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    setDropdownOpen(false);
  };

  const options = [
    { icon: <FiSun />, text: "Light", value: "light" },
    { icon: <FiMoon />, text: "Dark", value: "dark" },
    { icon: <FiMonitor />, text: "System", value: "system" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!isDropdownOpen)}
        className="p-2 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        title="Change theme"
      >
        <FiMoon size={20} />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-md shadow-xl z-20 border dark:border-gray-700">
          <div className="p-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => changeTheme(opt.value)}
                className={`flex items-center gap-3 w-full px-3 py-2 text-sm text-left rounded-md ${
                  theme === opt.value
                    ? "bg-gray-200 dark:bg-gray-700 font-semibold"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {opt.icon}
                <span>{opt.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DarkMode;