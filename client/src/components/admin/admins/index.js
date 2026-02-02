import React, { Fragment, useState, useEffect } from "react";
import AdminLayout from "../layout";
import { isAuthenticate } from "../../shop/auth/fetchApi";

const AdminsManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userRole: 1
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const { token } = isAuthenticate();
      const response = await fetch("/api/admin/all-admins", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        setAdmins(data.admins);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { token } = isAuthenticate();
    
    try {
      const url = editAdmin 
        ? `/api/admin/update-admin/${editAdmin._id}`
        : "/api/admin/create-admin";
      
      const method = editAdmin ? "PUT" : "POST";
      const body = editAdmin 
        ? { name: formData.name, email: formData.email, userRole: formData.userRole }
        : formData;
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        fetchAdmins();
        setShowModal(false);
        resetForm();
        alert(editAdmin ? "Admin updated successfully" : "Admin created successfully");
      }
    } catch (error) {
      console.error("Error saving admin:", error);
    }
  };

  const deleteAdmin = async (id) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        const { token } = isAuthenticate();
        const response = await fetch(`/api/admin/delete-admin/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.ok) {
          fetchAdmins();
          alert("Admin deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting admin:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", userRole: 1 });
    setEditAdmin(null);
  };

  const openEditModal = (admin) => {
    setEditAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: "",
      userRole: admin.userRole
    });
    setShowModal(true);
  };

  const getRoleText = (role) => {
    switch(role) {
      case 2: return "Super Admin";
      case 1: return "Admin";
      default: return "Customer";
    }
  };

  return (
    <Fragment>
      <AdminLayout>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Admin Management</h1>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add New Admin
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {admins.length > 0 ? admins.map((admin) => (
                  <tr key={admin._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {admin.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        admin.userRole === 2 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {getRoleText(admin.userRole)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {admin.email !== "admin@admin.com" && (
                        <>
                          <button
                            onClick={() => openEditModal(admin)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteAdmin(admin._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No admins found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                  {editAdmin ? "Edit Admin" : "Add New Admin"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-3 border rounded"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full p-3 border rounded"
                    required
                  />
                  {!editAdmin && (
                    <input
                      type="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full p-3 border rounded"
                      required
                    />
                  )}
                  <select
                    value={formData.userRole}
                    onChange={(e) => setFormData({...formData, userRole: parseInt(e.target.value)})}
                    className="w-full p-3 border rounded"
                  >
                    <option value={1}>Admin</option>
                    <option value={2}>Super Admin</option>
                  </select>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      {editAdmin ? "Update" : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </Fragment>
  );
};

export default AdminsManagement;