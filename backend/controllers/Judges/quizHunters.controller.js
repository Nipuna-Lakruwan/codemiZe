
import School from "../../models/School.js";

export const getMarking = async (req, res) => {
  try {
    // Fetch all schools and sort by QuizHunters score in descending order
    const schools = await School.find({})
      .select('name city nameInShort score.QuizHunters avatar')
      .sort({ 'score.QuizHunters': -1 });

    // Transform the data to match the desired output format
    const leaderboard = schools.map((school, index) => ({
      id: index + 1, // Sequential ID based on ranking
      name: school.name,
      city: school.city,
      nameInShort: school.nameInShort,
      score: school.score.QuizHunters,
      avatar: {
        url: school.avatar?.url || '/c-logo.png'
      }
    }));

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Error fetching QuizHunters leaderboard:", error);
    res.status(500).json({ message: "Error fetching QuizHunters leaderboard" });
  }
};