import School from "../../models/School.js";
import User from "../../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ["Admin", "Dashboard"] } }).select("-password -__v");
    const schools = await School.find().select("-password -__v");
    
    res.status(200).json({
      users,
      schools,
      total: users.length + schools.length
    });
  } catch (err) {
    res.status(500).json({ message: "Error getting users", error: err.message });
  }
};

export const getAllJudges = async (req, res) => {
  try {
    const judges = await User.find({ role: "Judge" }).select("-password -__v");
    res.status(200).json({
      judges,
    });
  } catch (err) {
    res.status(500).json({ message: "Error getting judges", error: err.message });
  }
};

export const getAllSchools = async (req, res) => {
  try {
    const schools = await School.find().select("-password -__v");
    
    res.status(200).json({
      schools,
      total: schools.length
    });
  } catch (err) {
    res.status(500).json({ message: "Error getting schools", error: err.message });
  }
};

export const editSchool = async (req, res) => {
  const { id } = req.params;
  const { name, email, city, nameInShort, password } = req.body;

  try {
    const updatedSchool = await School.findByIdAndUpdate(
      id,
      { name, email, city, nameInShort, password },
      { new: true }
    ).select("-password -__v");

    if (!updatedSchool) {
      return res.status(404).json({ message: "School not found" });
    }

    res.status(200).json({
      message: "School updated successfully",
      school: updatedSchool
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating school", error: err.message });
  }
};

export const editUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true }
    ).select("-password -__v");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Try to delete from User model first
    let deletedUser = await User.findById(userId);
    let userType = 'user';
    
    // If not found in User model, try School model
    if (!deletedUser) {
      deletedUser = await School.findById(userId);
      userType = 'school';
    }
    
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete avatar file if exists
    if (deletedUser.avatar && deletedUser.avatar.publicId) {
      try {
        await deleteFromLocal(deletedUser.avatar.publicId, 'avatars');
      } catch (error) {
        console.log('Error deleting avatar file:', error.message);
      }
    }

    // Now delete the user from database
    if (userType === 'user') {
      await User.findByIdAndDelete(userId);
    } else {
      await School.findByIdAndDelete(userId);
    }
    
    res.status(200).json({ 
      message: `${userType === 'user' ? 'User' : 'School'} deleted successfully`,
      deletedUser 
    });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};

export const deleteSchool = async (req, res) => {
  const { schoolId } = req.params;

  try {
    const deletedSchool = await School.findByIdAndDelete(schoolId);

    if (!deletedSchool) {
      return res.status(404).json({ message: "School not found" });
    }

    // Delete avatar file if exists
    if (deletedSchool.avatar && deletedSchool.avatar.publicId) {
      try {
        await deleteFromLocal(deletedSchool.avatar.publicId, 'avatars');
      } catch (error) {
        console.log('Error deleting avatar file:', error.message);
      }
    }

    res.status(200).json({
      message: "School deleted successfully",
      school: deletedSchool
    });
  } catch (err) {
    res.status(500).json({ message: "Error deleting school", error: err.message });
  }
}