import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import Container from "../../components/Container";
import { Link, useSearchParams } from "react-router-dom";
import { User, users } from "../../constant/mockUsers";
import Modal from "../../components/modal";
import { FiEdit, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { useAuthGuard } from "../../hooks/useAuthGuard";

const Dashboard = () => {
  useAuthGuard();

  const [activeUser, setActiveUser] = useState<string | null>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [roleFilter, setRoleFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[] | null>(null);
  
  const itemsPerPage = 5;

  useEffect(() => {
    const userFromStorage = localStorage.getItem("activeUser");
    setActiveUser(userFromStorage);
  }, []);

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    setPageNumber(page);
    setSearchQuery(searchParams.get("query") || "");
    setRoleFilter(searchParams.get("role") || "All");
  }, [searchParams]);

  useEffect(() => {
    const storedUserData = localStorage.getItem("allUsersData");
    if (storedUserData) {
      setAllUsers(JSON.parse(storedUserData));
    } else {
      localStorage.setItem("allUsersData", JSON.stringify(users));
      setAllUsers(users);
    }
  }, []);

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    searchParams.set("query", query);
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  const onRoleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const role = event.target.value;
    setRoleFilter(role);
    searchParams.set("role", role);
    searchParams.set("page", "1");
    setSearchParams(searchParams);
  };

  const filteredUsers =
    allUsers?.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (roleFilter === "All" || user.role === roleFilter)
    );

  const totalPages = Math.ceil(filteredUsers ? filteredUsers.length / itemsPerPage : 1);
  const validPage = Math.max(1, Math.min(pageNumber, totalPages));

  const usersOnCurrentPage =
    filteredUsers?.slice((validPage - 1) * itemsPerPage, validPage * itemsPerPage);

  const navigateToPage = (newPage: number) => {
    if (newPage < 1 || (newPage > totalPages && totalPages > 0)) return;
    setPageNumber(newPage);
    searchParams.set("page", newPage.toString());
    setSearchParams(searchParams);
  };

  const promptUserDeletion = (user: User) => {
    setUserToDelete(user);
    setDeleteModalVisible(true);
  };

  const confirmUserDeletion = () => {
    if (!userToDelete) return;
    const updatedUsers = allUsers?.filter((user) => user.id !== userToDelete.id) || null;
    setAllUsers(updatedUsers);
    localStorage.setItem("allUsersData", JSON.stringify(updatedUsers));
    setDeleteModalVisible(false);
    setUserToDelete(null);
  };

  const cancelUserDeletion = () => {
    setDeleteModalVisible(false);
    setUserToDelete(null);
  };

  useEffect(() => {
    if (pageNumber > totalPages && totalPages > 0) {
      navigateToPage(totalPages);
    }
  }, [pageNumber, totalPages]);

  return (
    <main className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-200 pb-10">
      <Navbar />
      <Container>
        <div className="pt-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Users Dashboard</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Welcome back, <span className="font-semibold text-indigo-600">{activeUser}</span>. Manage your users here.
          </p>
        </div>

        <div className="mt-6 bg-white dark:bg-gray-900 rounded-xl shadow-md">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex gap-4">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search by name..." value={searchQuery} onChange={onSearchChange} className="pl-10 pr-4 py-2 border bg-transparent border-gray-300 dark:border-gray-600 rounded-lg text-sm w-full md:w-auto"/>
                </div>
                <select
                  value={roleFilter}
                  onChange={onRoleFilterChange}
                  className="px-4 py-2 border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option className="bg-white dark:bg-gray-800" value="All">All Roles</option>
                  {[...new Set(allUsers?.map((user) => user.role) || [])].map((role) => (
                    <option className="bg-white dark:bg-gray-800" key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <Link to="/create/user">
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 w-full md:w-auto">
                  <FiPlus />
                  <span>Add User</span>
                </button>
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Username</th>
                  <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama Perusahaan</th>
                  <th scope="col" className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jabatan</th>
                  <th scope="col" className="px-6 py-3 text-center font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {usersOnCurrentPage?.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">{user.company}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-4">
                        <Link
                          to={`/update/user/${user.id}`}
                          className="p-2 rounded-md text-indigo-500 hover:text-indigo-700 transition-colors duration-200"
                          title="Edit"
                        >
                          <FiEdit size={16} />
                        </Link>
                        <button
                          onClick={() => promptUserDeletion(user)}
                          className="p-2 rounded-md text-red-500 hover:text-red-700 transition-colors duration-200"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <button onClick={() => navigateToPage(pageNumber - 1)} disabled={pageNumber <= 1} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm disabled:opacity-50">Previous</button>
            <span className="text-sm">Page {validPage} of {totalPages}</span>
            <button onClick={() => navigateToPage(pageNumber + 1)} disabled={validPage >= totalPages} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm disabled:opacity-50">Next</button>
          </div>
        </div>
        
      </Container>
      <Modal isOpen={isDeleteModalVisible} onClose={cancelUserDeletion} onConfirm={confirmUserDeletion} title="Confirm Deletion" message={`Are you sure you want to delete user: ${userToDelete?.name}?`}/>
    </main>
  );
};

export default Dashboard;