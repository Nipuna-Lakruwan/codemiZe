import React from 'react';
import AdminLayout from '../../../components/Admin/AdminLayout';

export default function UserManagement() {
  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">User Management</h2>
        <p>Manage users and teams here.</p>
        {/* Add your content here */}
      </div>
    </AdminLayout>
  );
}
