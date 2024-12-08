import React, { useState, useEffect } from "react";
import { Search, Edit2, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";

// Define the type for user entries
type User = {
  id: string; // UUID
  username: string | null; // Nullable username
  email: string;
  role: string | null; // Nullable role
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    role: "",
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Fetch data from profiles table
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, email, role")
        .order("username", { ascending: true });

      if (error) {
        console.error("Error fetching users:", error.message);
        alert(
          "Failed to fetch users. Please check your network or permissions."
        );
      } else {
        setUsers(data || []);
      }
      setIsLoading(false);
    };

    fetchUsers();
  }, []);

  // Handle Add/Edit User
  const handleSaveUser = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      !newUser.username.trim() ||
      !newUser.email.trim() ||
      !newUser.role.trim()
    ) {
      alert("All fields are required.");
      return;
    }
    if (!emailRegex.test(newUser.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (selectedUser) {
      // Update existing user
      const { error } = await supabase
        .from("profiles")
        .update({
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        })
        .eq("id", selectedUser.id);

      if (error) {
        console.error("Error updating user:", error.message);
        alert("Failed to update user.");
      } else {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedUser.id ? { ...user, ...newUser } : user
          )
        );
        setSelectedUser(null);
        setNewUser({ username: "", email: "", role: "" });
      }
    } else {
      // Add new user
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        })
        .select();

      if (error) {
        console.error("Error adding user:", error.message);
        alert("Failed to add user.");
      } else {
        setUsers([...(data || []), ...users]);
        setNewUser({ username: "", email: "", role: "" });
      }
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (id: string) => {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) {
      console.error("Error deleting user:", error.message);
      alert("Failed to delete user.");
    } else {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    }
  };

  // Load data into form for editing
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setNewUser({
      username: user.username || "",
      email: user.email,
      role: user.role || "",
    });
  };

  // Pagination logic
  const totalPages = Math.ceil(users.length / usersPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="h-full bg-gray-100 dark:bg-gray-900">
      {/* Form for Adding/Editing User */}
      <div
        className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg mb-6 mt-6"
        style={{ width: "97%", margin: "20px auto" }}
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          {selectedUser ? "Edit User" : "Add New User"}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>
        <button
          onClick={handleSaveUser}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          {selectedUser ? "Save Changes" : "Add User"}
        </button>
      </div>

      {/* Search */}
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 
                       border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 
                       focus:border-transparent"
            />
          </div>
        </div>

        {/* User Table */}
        {isLoading ? (
          <div className="text-center text-gray-500 dark:text-gray-400">
            Loading users...
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedUsers
                    .filter(
                      (user) =>
                        user.username
                          ?.toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        user.email
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        user.role
                          ?.toLowerCase()
                          .includes(searchTerm.toLowerCase())
                    )
                    .map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4">{user.username || "N/A"}</td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">{user.role || "N/A"}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit2 />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
              >
                Previous
              </button>
              <span className="text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
