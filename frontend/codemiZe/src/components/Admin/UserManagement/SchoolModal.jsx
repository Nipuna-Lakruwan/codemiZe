import React from 'react';
import { motion } from 'framer-motion';
import { FaUpload } from 'react-icons/fa';

export default function SchoolModal({
  show,
  onClose,
  schoolData,
  onChange,
  onSubmit,
  onFileChange,
  file,
  isEditing,
  showEmailField = false,
  loading = false
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl px-10 py-8 min-w-[500px] w-full max-w-[520px] flex flex-col border border-gray-200">
        <div className="text-2xl font-bold mb-2 text-purple-900">
          {isEditing ? 'Edit School' : 'Add School'}
        </div>
        <div className="mb-4 text-gray-500 text-sm">
          {isEditing ? 'Update school details below.' : 'Fill in the details to add a new school.'}
        </div>

        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">School Name</label>
            <input
              type="text"
              name="name"
              value={schoolData.name}
              onChange={onChange}
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-purple-500"
              placeholder="Enter school name"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={schoolData.city}
              onChange={onChange}
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-purple-500"
              placeholder="Enter city"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">Short Name</label>
            <input
              type="text"
              name="nameInShort"
              value={schoolData.nameInShort}
              onChange={onChange}
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-purple-500"
              placeholder="Enter short name (e.g., RC)"
              required
            />
          </div>

          {showEmailField && (
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={schoolData.email}
                onChange={onChange}
                className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-purple-500"
                placeholder="Enter email"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">
              {isEditing ? "New Password" : "Password"}
            </label>
            <input
              type="password"
              name="password"
              value={schoolData.password}
              onChange={onChange}
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-purple-500"
              placeholder={isEditing ? "Leave blank to keep current" : "Enter password"}
              required={!isEditing}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-700">School Logo</label>
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
              disabled={loading}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              className="px-4 py-2 bg-purple-600 text-white rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Processing...' : (isEditing ? 'Update' : 'Add')}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
