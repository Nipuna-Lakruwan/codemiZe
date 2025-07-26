import React from 'react';
import { FaUpload } from 'react-icons/fa';

export default function SchoolModal({
  show,
  onClose,
  schoolData,
  onChange,
  onSubmit,
  onFileChange,
  file,
  isEditing
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[500px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">
            {isEditing ? 'Edit School' : 'Add School'}
          </h3>
          <div className="justify-start text-black/80 text-base font-semibold font-['Inter']">
            <img src="/under-line.png" alt="underline" className="w-full h-1 mt-1" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">School Name</label>
            <input
              type="text"
              name="name"
              value={schoolData.name}
              onChange={onChange}
              className="w-full p-2 border rounded"
              placeholder="Enter school name"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">City</label>
            <input
              type="text"
              name="city"
              value={schoolData.city}
              onChange={onChange}
              className="w-full p-2 border rounded"
              placeholder="Enter city"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">Short Name</label>
            <input
              type="text"
              name="nameInShort"
              value={schoolData.nameInShort}
              onChange={onChange}
              className="w-full p-2 border rounded"
              placeholder="Enter short name (e.g., RC)"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">Email</label>
            <input
              type="text"
              name="email"
              value={schoolData.email}
              onChange={onChange}
              className="w-full p-2 border rounded"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={schoolData.password}
              onChange={onChange}
              className="w-full p-2 border rounded"
              placeholder={isEditing ? "Enter new password (leave empty to keep current)" : "Enter password"}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">School Logo</label>
            <div className="flex items-center">
              <input
                type="file"
                id="schoolLogo"
                onChange={onFileChange}
                className="hidden"
                accept="image/*"
              />
              <label htmlFor="schoolLogo" className="cursor-pointer flex items-center">
                <div className="w-11 h-8 bg-purple-800 rounded-sm flex items-center justify-center">
                  <FaUpload className="text-white" size={14} />
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {file ? file.name : "Choose file"}
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-purple-800 text-white rounded"
            onClick={onSubmit}
          >
            {isEditing ? 'Update School' : 'Add School'}
          </button>
        </div>
      </div>
    </div>
  );
}
