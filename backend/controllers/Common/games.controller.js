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
    const activeGame = await Game.findOne({ status: 'active' });
    res.status(200).json(activeGame);
  } catch (error) {
    console.error('Error fetching active game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const activateGame = async (req, res) => {
  const { gameId } = req.params;

  try {
    // First, deactivate all currently active games (but leave completed games unchanged)
    await Game.updateMany(
      { status: 'active' },
      { status: 'inactive' }
    );

    // Then activate the requested game
    const gameToActivate = await Game.findById(gameId);
    if (!gameToActivate) {
      return res.status(404).json({ error: 'Game not found' });
    }

    gameToActivate.status = 'active';
    await gameToActivate.save();

    //Here
    const io = req.app.get("io");
    io.emit('gameStateUpdate', {
      gameId: gameId,
      newStatus: 'active',
    });

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

    game.status = 'inactive';
    await game.save();

    const io = req.app.get("io");
    io.emit('gameStateUpdate', {
      gameId: gameId,
      newStatus: 'inactive',
    });

    io.emit('completed');

    res.status(200).json({ message: 'Game deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const completeGame = async (req, res) => {
  const { gameId } = req.params;

  try {
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    game.status = 'completed';
    await game.save();

    const io = req.app.get("io");
    io.emit('gameStateUpdate', {
      gameId: gameId,
      newStatus: 'completed',
    });

    res.status(200).json({ message: 'Game completed successfully' });
  } catch (error) {
    console.error('Error completing game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};