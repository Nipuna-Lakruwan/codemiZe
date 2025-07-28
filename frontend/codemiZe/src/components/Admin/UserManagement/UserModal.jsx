import React from 'react';
import { motion } from 'framer-motion';

const UserModal = ({
  show,
  onClose,
  userData,
  onChange,
  onSubmit,
  onFileChange,
  file,
  isEditing,
  showEmailField = false
}) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl px-10 py-8 min-w-[400px] w-full max-w-[420px] flex flex-col border border-gray-200">
        <div className="text-2xl font-bold mb-2 text-purple-900">{isEditing ? 'Edit User' : 'Add User'}</div>
        <div className="mb-4 text-gray-500 text-sm">{isEditing ? 'Update user details below.' : 'Fill in the details to add a new user.'}</div>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={onChange}
              placeholder="Full Name"
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={onChange}
              placeholder="Username"
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>
          {showEmailField && (
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={onChange}
                placeholder="Email"
                className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">{isEditing ? "New Password" : "Password"}</label>
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={onChange}
              placeholder={isEditing ? "Leave blank to keep current" : "Password"}
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-sky-500"
              required={!isEditing}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">Role</label>
            <select
              name="role"
              value={userData.role}
              onChange={onChange}
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-sky-500"
              required
            >
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="flex justify-end gap-2 mt-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-medium"
              onClick={onClose}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-sky-600 text-white rounded font-medium"
            >
              {isEditing ? 'Update' : 'Add'}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
