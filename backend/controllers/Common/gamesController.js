import Game from '../../models/Game.js';

export const getGames = async (req, res) => {
  try {
    const games = await Game.find(); // Fetch all games from the database
    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getActiveGame = async (req, res) => {
  try {
    const activeGame = await Game.findOne({ isActive: true });
    res.status(200).json(activeGame);
  } catch (error) {
    console.error('Error fetching active game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const activateGame = async (req, res) => {
  const { gameId } = req.params;

  try {
    const games = await Game.find();

    // Update each game's isActive flag
    for (const g of games) {
      g.isActive = g._id.equals(gameId);
      await g.save(); // Save each update
    }

    // Emit the updated games list to all connected clients
    const updatedGames = await Game.find();
    req.app.get('io').emit('gamesUpdated', updatedGames);

    res.status(200).json({ message: 'Game activated successfully' });
  } catch (error) {
    console.error('Error activating game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deactivateGame = async (req, res) => {
  const { gameId } = req.params;

  try {
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    game.isActive = false;
    await game.save();

    res.status(200).json({ message: 'Game deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};