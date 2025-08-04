import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../components/Admin/AdminLayout';
import SchoolsSection from '../../../components/Admin/UserManagement/SchoolsSection';
import JudgesSection from '../../../components/Admin/UserManagement/JudgesSection';
import UsersSection from '../../../components/Admin/UserManagement/UsersSection';
import SchoolModal from '../../../components/Admin/UserManagement/SchoolModal';
import JudgeModal from '../../../components/Admin/UserManagement/JudgeModal';
import UserModal from '../../../components/Admin/UserManagement/UserModal';
import ScrollbarStyles from '../../../components/Admin/UserManagement/ScrollbarStyles';
import Toast from '../../../components/Admin/UserManagement/Toast';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPaths';
import { imagePath, createFormData, validateForm } from '../../../utils/helper';

export default function UserManagement() {
  // Data states
  const [schools, setSchools] = useState([]);
  const [judges, setJudges] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);
  
  // Modal states
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);
  const [showAddJudgeModal, setShowAddJudgeModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Form data states
  const [newSchool, setNewSchool] = useState({ 
    name: '', 
    city: '', 
    nameInShort: '', 
    email: '', 
    password: '' 
  });
  const [newJudge, setNewJudge] = useState({ 
    name: '', 
    email: '', 
    password: '' 
  });
  const [newUser, setNewUser] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'Admin' 
  });

  // File upload states
  const [schoolLogo, setSchoolLogo] = useState(null);
  const [judgePhoto, setJudgePhoto] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);

  // Edit mode states
  const [editingId, setEditingId] = useState(null);
  const [editingType, setEditingType] = useState(null);

  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [schoolsRes, judgesRes, usersRes] = await Promise.all([
          axiosInstance.get(API_PATHS.ADMIN.GET_ALL_SCHOOLS),
          axiosInstance.get(API_PATHS.ADMIN.GET_ALL_JUDGES),
          axiosInstance.get(API_PATHS.ADMIN.GET_ALL_USERS)
        ]);

        setSchools(schoolsRes.data.schools || []);
        setJudges(judgesRes.data.judges || []);
        setUsers(usersRes.data.users || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Utility functions
  const resetFormStates = (type) => {
    if (type === 'school' || !type) {
      setNewSchool({ name: '', city: '', nameInShort: '', email: '', password: '' });
      setSchoolLogo(null);
    }
    if (type === 'judge' || !type) {
      setNewJudge({ name: '', email: '', password: '' });
      setJudgePhoto(null);
    }
    if (type === 'user' || !type) {
      setNewUser({ name: '', email: '', password: '', role: 'Admin' });
      setUserPhoto(null);
    }
    setEditingId(null);
    setEditingType(null);
  };

  const closeModal = (type) => {
    if (type === 'school') setShowAddSchoolModal(false);
    if (type === 'judge') setShowAddJudgeModal(false);
    if (type === 'user') setShowAddUserModal(false);
    resetFormStates(type);
  };

  const showSuccessMessage = (message) => {
    setToast({ show: true, message, type: 'success' });
  };

  const showErrorMessage = (message) => {
    setToast({ show: true, message, type: 'error' });
  };

  const closeToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  // Handle file changes
  const handleFileChange = (e, setFile) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handle form input changes
  const handleSchoolChange = (e) => {
    setNewSchool({ ...newSchool, [e.target.name]: e.target.value });
  };

  const handleJudgeChange = (e) => {
    setNewJudge({ ...newJudge, [e.target.name]: e.target.value });
  };

  const handleUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  // Handle add/edit school
  const handleAddOrUpdateSchool = async () => {
    try {
      setOperationLoading(true);
      
      // Validation
      const errors = validateForm(newSchool, ['name', 'email', 'city', 'nameInShort']);
      if (!editingId && !newSchool.password.trim()) {
        errors.push('password is required');
      }
      
      if (errors.length > 0) {
        showErrorMessage(`Please fill in all required fields: ${errors.join(', ')}`);
        setOperationLoading(false);
        return;
      }

      if (editingId !== null) {
        // Update existing school with FormData for file upload support
        const formData = createFormData({
          name: newSchool.name,
          email: newSchool.email,
          city: newSchool.city,
          nameInShort: newSchool.nameInShort,
          ...(newSchool.password && { password: newSchool.password })
        }, 'avatar', schoolLogo);

        const response = await axiosInstance.put(API_PATHS.ADMIN.EDIT_SCHOOL(editingId), formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        // Update the school in local state with the response data
        setSchools(schools.map(school =>
          school._id === editingId
            ? { 
                ...school, 
                ...newSchool, 
                avatar: response.data.school?.avatar || school.avatar
              }
            : school
        ));
        
        showSuccessMessage('School updated successfully');
      } else {
        // Create new school with FormData for file upload
        const formData = createFormData({
          name: newSchool.name,
          email: newSchool.email,
          city: newSchool.city,
          nameInShort: newSchool.nameInShort,
          password: newSchool.password,
          role: 'School'
        }, 'avatar', schoolLogo);

        const response = await axiosInstance.post(API_PATHS.AUTH.CREATE_SCHOOL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        setSchools([...schools, {
          id: response.data.id,
          ...newSchool,
          avatar: response.data.school?.avatar || { url: '/c-logo.png' }
        }]);
        
        showSuccessMessage('School created successfully');
      }

      closeModal('school');
    } catch (error) {
      console.error('Error with school operation:', error);
      const errorMessage = error.response?.data?.message || (editingId ? 'Failed to update school' : 'Failed to create school');
      showErrorMessage(errorMessage);
    } finally {
      setOperationLoading(false);
    }
  };

  // Handle add/edit judge
  const handleAddOrUpdateJudge = async () => {
    try {
      setOperationLoading(true);
      
      // Validation
      const errors = validateForm(newJudge, ['name', 'email']);
      if (!editingId && !newJudge.password.trim()) {
        errors.push('password is required');
      }
      
      if (errors.length > 0) {
        showErrorMessage(`Please fill in all required fields: ${errors.join(', ')}`);
        setOperationLoading(false);
        return;
      }

      if (editingId !== null) {
        // Update existing judge with FormData for file upload support
        const formData = createFormData({
          name: newJudge.name,
          email: newJudge.email,
          role: 'Judge',
          ...(newJudge.password && { password: newJudge.password })
        }, 'avatar', judgePhoto);

        const response = await axiosInstance.put(API_PATHS.ADMIN.EDIT_USER(editingId), formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        // Update the judge in local state with the response data
        setJudges(judges.map(judge =>
          judge._id === editingId
            ? { 
                ...judge, 
                ...newJudge, 
                avatar: response.data.user?.avatar || judge.avatar
              }
            : judge
        ));
        
        showSuccessMessage('Judge updated successfully');
      } else {
        // Create new judge with FormData for file upload
        const formData = createFormData({
          name: newJudge.name,
          email: newJudge.email,
          password: newJudge.password,
          role: 'Judge'
        }, 'avatar', judgePhoto);

        const response = await axiosInstance.post(API_PATHS.AUTH.CREATE_USER, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        setJudges([...judges, {
          id: response.data.id,
          ...newJudge,
          avatar: response.data.user?.avatar || { url: '/c-logo.png' }
        }]);
        
        showSuccessMessage('Judge created successfully');
      }

      closeModal('judge');
    } catch (error) {
      console.error('Error with judge operation:', error);
      const errorMessage = error.response?.data?.message || (editingId ? 'Failed to update judge' : 'Failed to create judge');
      showErrorMessage(errorMessage);
    } finally {
      setOperationLoading(false);
    }
  };

  // Handle add/edit user
  const handleAddOrUpdateUser = async () => {
    try {
      setOperationLoading(true);
      
      // Validation
      const errors = validateForm(newUser, ['name', 'email', 'role']);
      if (!editingId && !newUser.password.trim()) {
        errors.push('password is required');
      }
      
      if (errors.length > 0) {
        showErrorMessage(`Please fill in all required fields: ${errors.join(', ')}`);
        setOperationLoading(false);
        return;
      }

      if (editingId !== null) {
        // Update existing user with FormData for file upload support
        const formData = createFormData({
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          ...(newUser.password && { password: newUser.password })
        }, 'avatar', userPhoto);

        const response = await axiosInstance.put(API_PATHS.ADMIN.EDIT_USER(editingId), formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        // Update the user in local state with the response data
        setUsers(users.map(user =>
          user._id === editingId
            ? { 
                ...user, 
                ...newUser, 
                avatar: response.data.user?.avatar || user.avatar
              }
            : user
        ));
        
        showSuccessMessage('User updated successfully');
      } else {
        // Create new user with FormData for file upload
        const formData = createFormData({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role
        }, 'avatar', userPhoto);

        const response = await axiosInstance.post(API_PATHS.AUTH.CREATE_USER, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        setUsers([...users, {
          id: response.data.id,
          ...newUser,
          avatar: response.data.user?.avatar || { url: '/c-logo.png' }
        }]);
        
        showSuccessMessage('User created successfully');
      }

      closeModal('user');
    } catch (error) {
      console.error('Error with user operation:', error);
      const errorMessage = error.response?.data?.message || (editingId ? 'Failed to update user' : 'Failed to create user');
      showErrorMessage(errorMessage);
    } finally {
      setOperationLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (id, type) => {
    setEditingId(id);
    setEditingType(type);

    if (type === 'school') {
      const school = schools.find(s => s._id === id);
      if (school) {
        setNewSchool({
          name: school.name || '',
          city: school.city || '',
          nameInShort: school.nameInShort || '',
          email: school.email || '',
          password: ''
        });
        setShowAddSchoolModal(true);
      }
    } else if (type === 'judge') {
      const judge = judges.find(j => j._id === id);
      if (judge) {
        setNewJudge({
          name: judge.name || '',
          email: judge.email || '',
          password: ''
        });
        setShowAddJudgeModal(true);
      }
    } else if (type === 'user') {
      const user = users.find(u => u._id === id);
      if (user) {
        setNewUser({
          name: user.name || '',
          email: user.email || '',
          password: '',
          role: user.role || 'Admin'
        });
        setShowAddUserModal(true);
      }
    }
  };

  // Handle delete
  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    try {
      if (type === 'school') {
        await axiosInstance.delete(API_PATHS.ADMIN.DELETE_SCHOOL(id));
        setSchools(schools.filter(school => school._id !== id));
        showSuccessMessage('School deleted successfully');
      } else if (type === 'judge') {
        await axiosInstance.delete(API_PATHS.ADMIN.DELETE_USER(id));
        setJudges(judges.filter(judge => judge._id !== id));
        showSuccessMessage('Judge deleted successfully');
      } else if (type === 'user') {
        await axiosInstance.delete(API_PATHS.ADMIN.DELETE_USER(id));
        setUsers(users.filter(user => user._id !== id));
        showSuccessMessage('User deleted successfully');
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      showErrorMessage(`Failed to delete ${type}`);
    }
  };

  // Handle opening add modals
  const handleAdd = (type) => {
    resetFormStates();
    if (type === 'school') {
      setShowAddSchoolModal(true);
    } else if (type === 'judge') {
      setShowAddJudgeModal(true);
    } else if (type === 'user') {
      setShowAddUserModal(true);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-lg">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-red-600">{error}</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 p-4">
        {/* Schools Section */}
        <SchoolsSection
          schools={schools}
          onAdd={() => handleAdd('school')}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Judges Section */}
        <JudgesSection
          judges={judges}
          onAdd={() => handleAdd('judge')}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Users Section */}
        <UsersSection
          users={users}
          onAdd={() => handleAdd('user')}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modals */}
      <SchoolModal
        show={showAddSchoolModal}
        onClose={() => closeModal('school')}
        schoolData={newSchool}
        onChange={handleSchoolChange}
        onSubmit={handleAddOrUpdateSchool}
        onFileChange={(e) => handleFileChange(e, setSchoolLogo)}
        file={schoolLogo}
        isEditing={editingId !== null && editingType === 'school'}
        showEmailField={true}
        loading={operationLoading}
      />

      <JudgeModal
        show={showAddJudgeModal}
        onClose={() => closeModal('judge')}
        judgeData={newJudge}
        onChange={handleJudgeChange}
        onSubmit={handleAddOrUpdateJudge}
        onFileChange={(e) => handleFileChange(e, setJudgePhoto)}
        file={judgePhoto}
        isEditing={editingId !== null && editingType === 'judge'}
        showEmailField={true}
        loading={operationLoading}
      />

      <UserModal
        show={showAddUserModal}
        onClose={() => closeModal('user')}
        userData={newUser}
        onChange={handleUserChange}
        onSubmit={handleAddOrUpdateUser}
        onFileChange={(e) => handleFileChange(e, setUserPhoto)}
        file={userPhoto}
        isEditing={editingId !== null && editingType === 'user'}
        showEmailField={true}
        loading={operationLoading}
      />

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />

      <ScrollbarStyles />
    </AdminLayout>
  );
}