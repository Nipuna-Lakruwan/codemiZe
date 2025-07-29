import User from "../models/User.js";

export const seedDefaultUsers = async () => {
  try {
    const adminExists = await User.findOne({ role: "Admin" });
    const dashboardExists = await User.findOne({ role: "Dashboard" });

    const usersToCreate = [];

    if (!adminExists) {
      usersToCreate.push({
        name: "System Admin",
        email: "admin@test.com",
        password: "$2b$10$qNTR1sciGE6cw2gG6pt7zuk7pW0Io53ysdmYBSWo1QEoZUkWDi7wi",
        role: "Admin",
        avatar: {
          url: "",
          publicId: "",
        },
      });
    }

    if (!dashboardExists) {
      usersToCreate.push({
        name: "Dashboard User",
        email: "dashboard@test.com",
        password: "$2b$10$qNTR1sciGE6cw2gG6pt7zuk7pW0Io53ysdmYBSWo1QEoZUkWDi7wi",
        role: "Dashboard",
        avatar: {
          url: "",
          publicId: "",
        },
      });
    }

    if (usersToCreate.length > 0) {
      await User.insertMany(usersToCreate);
      console.log("Default users seeded successfully.");
    } else {
      console.log("Default users already exist.");
    }
  } catch (err) {
    console.error("Error seeding default users:", err);
  }
};