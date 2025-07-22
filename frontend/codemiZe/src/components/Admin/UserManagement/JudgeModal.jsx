import React from 'react';
import { FaUpload } from 'react-icons/fa';

export default function JudgeModal({
  show,
  onClose,
  judgeData,
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
            {isEditing ? 'Edit Judge' : 'Add Judge'}
          </h3>
          <div className="justify-start text-black/80 text-base font-semibold font-['Inter']">
            <img src="/under-line.png" alt="underline" className="w-full h-1 mt-1" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={judgeData.name}
              onChange={onChange}
              className="w-full p-2 border rounded"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">Username</label>
            <input
              type="text"
              name="username"
              value={judgeData.username}
              onChange={onChange}
              className="w-full p-2 border rounded"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={judgeData.password}
              onChange={onChange}
              className="w-full p-2 border rounded"
              placeholder={isEditing ? "Enter new password (leave empty to keep current)" : "Enter password"}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">Profile Photo</label>
            <div className="flex items-center">
              <input
                type="file"
                id="judgePhoto"
                onChange={onFileChange}
                className="hidden"
                accept="image/*"
              />
              <label htmlFor="judgePhoto" className="cursor-pointer flex items-center">
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
            {isEditing ? 'Update Judge' : 'Add Judge'}
          </button>
        </div>
      </div>
    </div>
  );
}
