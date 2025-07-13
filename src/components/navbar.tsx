import { Link } from "react-router-dom";
import Container from "./Container";
import Dropdown from "./dropdown";
import DarkMode from "./dark-mode";

const Navbar = () => {
  return (
    <div className="w-full z-20 p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <Container>
        <div className="flex justify-between items-center">
          <div>
            <Link to="/" className="text-indigo-600 font-bold text-2xl">
              Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <DarkMode />
            <Dropdown />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;