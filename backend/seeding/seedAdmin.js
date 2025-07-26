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
        password: "test@123",
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
        password: "test@123",
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