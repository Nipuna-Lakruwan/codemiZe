import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../components/Admin/AdminLayout';
import SchoolsSection from '../../../components/Admin/UserManagement/SchoolsSection';
import JudgesSection from '../../../components/Admin/UserManagement/JudgesSection';
import UsersSection from '../../../components/Admin/UserManagement/UsersSection';
import SchoolModal from '../../../components/Admin/UserManagement/SchoolModal';
import JudgeModal from '../../../components/Admin/UserManagement/JudgeModal';
import UserModal from '../../../components/Admin/UserManagement/UserModal';
import ScrollbarStyles from '../../../components/Admin/UserManagement/ScrollbarStyles';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPaths';

export default function UserManagement() {
  const [schools, setSchools] = useState([]);
  const [judges, setJudges] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getInfo = async () => {
      const scls = await axiosInstance.get(API_PATHS.ADMIN.GET_ALL_SCHOOLS);
      const jds = await axiosInstance.get(API_PATHS.ADMIN.GET_ALL_JUDGES);
      const usrs = await axiosInstance.get(API_PATHS.ADMIN.GET_ALL_USERS);

      try {
        setSchools(scls.data.schools);
        setJudges(jds.data.judges);
        setUsers(usrs.data.users);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    getInfo();
  }, []);

  // State for modals
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false);
  const [showAddJudgeModal, setShowAddJudgeModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // State for form inputs
  const [newSchool, setNewSchool] = useState({ name: '', city: '', nameInShort: '', email: '', password: '' });
  const [newJudge, setNewJudge] = useState({ name: '', email: '', password: '' });
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'Dashboard' });

  // State for file uploads
  const [schoolLogo, setSchoolLogo] = useState(null);
  const [judgePhoto, setJudgePhoto] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);

  // State for edit mode
  const [editingId, setEditingId] = useState(null);
  const [editingType, setEditingType] = useState(null); // 'school', 'judge', or 'user'

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
    if (editingId !== null) {
      setSchools(schools.map(school =>
        school.id === editingId
          ? { ...school, ...newSchool, avatar: schoolLogo ? { url: URL.createObjectURL(schoolLogo) } : school.avatar }
          : school
      ));
      setEditingId(null);
      setEditingType(null);
    } else {
      try {
       await axiosInstance.post(API_PATHS.AUTH.CREATE_SCHOOL, { name: newSchool.name, email: newSchool.email, city: newSchool.city, nameInShort: newSchool.nameInShort, password: newSchool.password, avatar: schoolLogo, role: "School" });
      } catch (error) {
        console.error('Error creating school:', error);
      }
      setSchools([...schools, {
        id: newId,
        ...newSchool,
        avatar: { url: schoolLogo ? URL.createObjectURL(schoolLogo) : '/c-logo.png' }
      }]);
    }
    setNewSchool({ name: '', city: '', nameInShort: '', email: '', password: '' });

    setSchoolLogo(null);
    setShowAddSchoolModal(false);
  };

  // Handle add/edit judge
  const handleAddOrUpdateJudge = () => {
    if (editingId !== null) {
      setJudges(judges.map(judge =>
        judge.id === editingId
          ? { ...judge, ...newJudge, avatar: judgePhoto ? { url: URL.createObjectURL(judgePhoto) } : judge.avatar }
          : judge
      ));
      setEditingId(null);
      setEditingType(null);
    } else {
      const newId = Math.max(0, ...judges.map(j => j.id)) + 1;
      setJudges([...judges, {
        id: newId,
        ...newJudge,
        avatar: { url: judgePhoto ? URL.createObjectURL(judgePhoto) : '/c-logo.png' }
      }]);
    }
    setNewJudge({ name: '', email: '', password: '' });
    setJudgePhoto(null);
    setShowAddJudgeModal(false);
  };

  // Handle add/edit user
  const handleAddOrUpdateUser = () => {
    if (editingId !== null) {
      setUsers(users.map(user =>
        user.id === editingId
          ? { ...user, ...newUser, avatar: userPhoto ? { url: URL.createObjectURL(userPhoto) } : user.avatar }
          : user
      ));
      setEditingId(null);
      setEditingType(null);
    } else {
      const newId = Math.max(0, ...users.map(u => u.id)) + 1;
      setUsers([...users, {
        id: newId,
        ...newUser,
        avatar: { url: userPhoto ? URL.createObjectURL(userPhoto) : '/c-logo.png' }
      }]);
    }
    setNewUser({ name: '', email: '', password: '', role: 'Staff' });
    setUserPhoto(null);
    setShowAddUserModal(false);
  };

  // Handle edit
  const handleEdit = (id, type) => {
    setEditingId(id);
    setEditingType(type);

    if (type === 'school') {
      const school = schools.find(s => s.id === id);
      setNewSchool({
        name: school.name,
        city: school.city,
        nameInShort: school.nameInShort,
        email: school.email,
        password: '' // We don't populate password for security reasons
      });
      setShowAddSchoolModal(true);
    } else if (type === 'judge') {
      const judge = judges.find(j => j.id === id);
      setNewJudge({
        name: judge.name,
        email: judge.email,
        password: '' // We don't populate password for security reasons
      });
      setShowAddJudgeModal(true);
    } else if (type === 'user') {
      const user = users.find(u => u.id === id);
      setNewUser({
        name: user.name,
        email: user.email,
        password: '', // We don't populate password for security reasons
        role: user.role
      });
      setShowAddUserModal(true);
    }
  };

  // Handle delete
  const handleDelete = (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      if (type === 'school') {
        setSchools(schools.filter(school => school.id !== id));
      } else if (type === 'judge') {
        setJudges(judges.filter(judge => judge.id !== id));
      } else if (type === 'user') {
        setUsers(users.filter(user => user.id !== id));
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 p-4">
        {/* Schools Section */}
        <SchoolsSection
          schools={schools}
          onAdd={() => {
            setEditingId(null);
            setEditingType(null);
            setNewSchool({ name: '', city: '', nameInShort: '', email: '', password: '' });
            setSchoolLogo(null);
            setShowAddSchoolModal(true);
          }}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Judges Section */}
        <JudgesSection
          judges={judges}
          onAdd={() => {
            setEditingId(null);
            setEditingType(null);
            setNewJudge({ name: '', email: '', password: '' });
            setJudgePhoto(null);
            setShowAddJudgeModal(true);
          }}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Users Section */}
        <UsersSection
          users={users}
          onAdd={() => {
            setEditingId(null);
            setEditingType(null);
            setNewUser({ name: '', email: '', password: '', role: 'Staff' });
            setUserPhoto(null);
            setShowAddUserModal(true);
          }}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Modals */}
      <SchoolModal
        show={showAddSchoolModal}
        onClose={() => {
          setShowAddSchoolModal(false);
          setEditingId(null);
          setEditingType(null);
        }}
        schoolData={newSchool}
        onChange={handleSchoolChange}
        onSubmit={handleAddOrUpdateSchool}
        onFileChange={(e) => handleFileChange(e, setSchoolLogo)}
        file={schoolLogo}
        isEditing={editingId !== null && editingType === 'school'}
      />

      <JudgeModal
        show={showAddJudgeModal}
        onClose={() => {
          setShowAddJudgeModal(false);
          setEditingId(null);
          setEditingType(null);
        }}
        judgeData={newJudge}
        onChange={handleJudgeChange}
        onSubmit={handleAddOrUpdateJudge}
        onFileChange={(e) => handleFileChange(e, setJudgePhoto)}
        file={judgePhoto}
        isEditing={editingId !== null && editingType === 'judge'}
      />

      <UserModal
        show={showAddUserModal}
        onClose={() => {
          setShowAddUserModal(false);
          setEditingId(null);
          setEditingType(null);
        }}
        userData={newUser}
        onChange={handleUserChange}
        onSubmit={handleAddOrUpdateUser}
        onFileChange={(e) => handleFileChange(e, setUserPhoto)}
        file={userPhoto}
        isEditing={editingId !== null && editingType === 'user'}
      />

      {/* Custom scrollbar styles */}
      <ScrollbarStyles />
    </AdminLayout>
  );
}