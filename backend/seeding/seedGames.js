import Game from "../models/Game.js";

export const seedGames = async () => {
  const existingGames = await Game.find();
  if (existingGames.length > 0) {
    console.log("Games already seeded");
    return;
  }

  const gamesData = [
    {
      name: "Quiz Hunters",
      allocateTime: 30,
      icon: {
        url: "uploads/gameIcons/QuizHunters.png",
        publicId: "QuizHunters.png"
      }
    },
    {
      name: "Code Crushers",
      allocateTime: 30,
      icon: {
        url: "uploads/gameIcons/CodeCrushers.png",
        publicId: "CodeCrushers.png"
      }
    },
    {
      name: "Circuit Smashers",
      allocateTime: 30,
      icon: {
        url: "uploads/gameIcons/CircuitSmashers.png",
        publicId: "CircuitSmashers.png"
      }
    },
    {
      name: "Route Seekers",
      allocateTime: 30,
      icon: {
        url: "uploads/gameIcons/RouteSeekers.png",
        publicId: "RouteSeekers.png"
      }
    },
    {
      name: "Battle Breakers",
      allocateTime: 30,
      icon: {
        url: "uploads/gameIcons/BattleBreakers.png",
        publicId: "BattleBreakers.png"
      }
    }
  ];

  try {
    await Game.insertMany(gamesData);
    console.log("Games seeded successfully");
  } catch (err) {
    console.error("Error seeding games:", err);
  }
};