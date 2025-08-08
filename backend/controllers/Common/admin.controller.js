import School from "../../models/School.js";
import User from "../../models/User.js";
import { imagePath } from "../../utils/helper.js";
import { deleteFromLocal } from "../../config/localStorage.js";

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
    // Find the existing school first
    const existingSchool = await School.findById(id);
    if (!existingSchool) {
      return res.status(404).json({ message: "School not found" });
    }

    // Handle avatar upload
    let avatarData = existingSchool.avatar; // Keep existing avatar by default
    if (req.file) {
      // Delete old avatar if it exists and is not the default
      if (existingSchool.avatar && existingSchool.avatar.publicId && existingSchool.avatar.publicId !== 'default') {
        try {
          await deleteFromLocal(existingSchool.avatar.publicId, 'avatars');
        } catch (error) {
          console.log('Error deleting old avatar:', error.message);
        }
      }
      
      // Set new avatar data
      avatarData = {
        url: `/uploads/avatars/${req.file.filename}`,
        publicId: req.file.filename
      };
    }

    // Prepare update data
    const updateData = {
      name,
      email,
      city,
      nameInShort,
      avatar: avatarData,
      ...(password && { password }) // Only include password if provided
    };

    const updatedSchool = await School.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select("-password -__v");

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
  const { name, email, role, password } = req.body;
  
  try {
    // Find the existing user first
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle avatar upload
    let avatarData = existingUser.avatar; // Keep existing avatar by default
    if (req.file) {
      // Delete old avatar if it exists and is not the default
      if (existingUser.avatar && existingUser.avatar.publicId && existingUser.avatar.publicId !== 'default') {
        try {
          await deleteFromLocal(existingUser.avatar.publicId, 'avatars');
        } catch (error) {
          console.log('Error deleting old avatar:', error.message);
        }
      }
      
      // Set new avatar data
      avatarData = {
        url: `/uploads/avatars/${req.file.filename}`,
        publicId: req.file.filename
      };
    }

    // Prepare update data
    const updateData = {
      name,
      email,
      role,
      avatar: avatarData,
      ...(password && { password }) // Only include password if provided
    };

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select("-password -__v");

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

export const showWinners = async (req, res) => {
  try {
    const schools = await School.aggregate([
      {
        $addFields: {
          totalScore: {
            $add: [
              { $ifNull: ["$score.QuizHunters", 0] },
              { $ifNull: ["$score.CodeCrushers", 0] },
              { $ifNull: ["$score.CircuitSmashers", 0] },
              { $ifNull: ["$score.RouteSeekers", 0] },
              { $ifNull: ["$score.BattleBreakers", 0] }
            ]
          }
        }
      },
      {
        $sort: { totalScore: -1 }
      },
      {
        $match: { totalScore: { $gt: 0 } }
      },
      {
        $limit: 2
      },
      {
        $project: {
          _id: 0,
          name: 1,
          city: 1,
          avatar: 1,
          totalScore: 1
        }
      }
    ]);

    if (schools.length === 0) {
      return res.status(404).json({ message: "No schools with scores found." });
    }

    res.status(200).json({
      winners: schools,
      total: schools.length
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching overall winners", error: err.message });
  }
};

const CATEGORY_KEYS = {
  "quiz-hunters": "QuizHunters",
  "code-crushers": "CodeCrushers",
  "circuit-smashers": "CircuitSmashers",
  "route-seekers": "RouteSeekers",
  "battle-breakers": "BattleBreakers",
};

export const getTeamScores = async () => {
  const teamScores = {};

  // Handle individual categories
  for (const [key, dbField] of Object.entries(CATEGORY_KEYS)) {
    const topSchools = await School.find({ [`score.${dbField}`]: { $gt: 0 } })
      .sort({ [`score.${dbField}`]: -1 })
      .limit(5)
      .select("name city score avatar")
      .lean();

    teamScores[key] = topSchools.map(school => ({
      name: school.name,
      city: school.city,
      logo: imagePath(school.avatar.url),
      score: school.score[dbField]
    }));
  }

  // Handle overall scores
  const overallTop = await School.aggregate([
    {
      $addFields: {
        totalScore: {
          $add: [
          { $ifNull: ["$score.QuizHunters", 0] },
          { $ifNull: ["$score.CodeCrushers", 0] },
          { $ifNull: ["$score.CircuitSmashers", 0] },
          { $ifNull: ["$score.RouteSeekers", 0] },
          { $ifNull: ["$score.BattleBreakers", 0] }
          ]
        }
      }
    },
    { $match: { totalScore: { $gt: 0 } } },
    { $sort: { totalScore: -1 } },
    { $limit: 10 },
    {
      $project: {
        name: 1,
        city: 1,
        totalScore: 1,
        avatar: 1
      }
    }
  ]);

  teamScores["overall"] = overallTop.map(school => ({
    name: school.name,
    city: school.city,
    logo: imagePath(school.avatar.url),
    score: school.totalScore
  }));

  return teamScores;
};

export const getSchoolScores = async (req, res) => {
  try {
    const scores = await getTeamScores();
    res.status(200).json(scores);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch team scores", error: err.message });
  }
};