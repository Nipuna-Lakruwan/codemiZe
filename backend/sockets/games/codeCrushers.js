import GameTimer from "../gameTimer.js";

/**
 * Code Crushers Socket Handler
 * 
 * This file handles all socket events and timer functionality specific to Code Crushers game.
 * 
 * Events handled:
 * - codeCrushers-startChallenge: Start a new coding challenge with timer
 * - codeCrushers-stopChallenge: Stop current challenge and timer
 * - codeCrushers-pauseTimer: Pause the current timer
 * - codeCrushers-resumeTimer: Resume the paused timer
 * - codeCrushers-requestCurrentState: Send current game state to reconnecting clients
 * 
 * Events emitted:
 * - codeCrushers-challengeStarted: Challenge started for clients
 * - codeCrushers-timerUpdate: Timer countdown updates
 * - codeCrushers-timeUp: Timer expired
 * - codeCrushers-timerStopped: Timer manually stopped
 * - codeCrushers-syncTimer: Timer sync for reconnecting clients
 */

class CodeCrushersHandler {
  constructor() {
    this.timer = new GameTimer('codeCrushers');
    this.roomName = 'codeCrushers';
    this.io = null;
  }

  /**
   * Initialize the handler with socket.io instance
   * @param {Object} io - Socket.io instance
   */
  initialize(io) {
    this.io = io;
    this.timer.setSocketInstance(io);
    console.log('Code Crushers handler initialized');
  }

  /**
   * Initialize a client connection and set up event listeners
   * @param {Object} socket - Individual socket connection
   * @param {Object} io - Socket.io instance
   */
  initializeClient(socket, io) {
    if (!this.io) {
      this.initialize(io);
    }

    // Join the Code Crushers room
    socket.join(this.roomName);
    console.log(`Code Crushers client joined - Role: ${socket.user.role}`);

    // Send current challenge and timer state to newly connected client
    this.syncClientState(socket);

    // Register event listeners for this client
    this.registerEventListeners(socket);
  }

  /**
   * Sync current game state with a reconnecting client
   * @param {Object} socket - Individual socket connection
   */
  syncClientState(socket) {
    const currentChallengeData = this.timer.getCurrentQuestionData();
    
    if (currentChallengeData && this.timer.isTimerActive()) {
      console.log(`Syncing Code Crushers state: ${currentChallengeData.timeRemaining}s remaining`);
      
      socket.emit("codeCrushers-challengeStarted", {
        challengeType: currentChallengeData.challengeType,
        difficulty: currentChallengeData.difficulty,
        allocatedTime: currentChallengeData.allocatedTime,
        isReconnect: true
      });
      
      this.timer.syncTimerWithClient(socket);
    }
  }

  /**
   * Register all event listeners for Code Crushers
   * @param {Object} socket - Individual socket connection
   */
  registerEventListeners(socket) {
    socket.on("codeCrushers-startChallenge", (data) => {
      this.handleStartChallenge(data);
    });

    socket.on("codeCrushers-stopChallenge", () => {
      this.handleStopChallenge();
    });

    socket.on("codeCrushers-pauseTimer", () => {
      this.handlePauseTimer();
    });

    socket.on("codeCrushers-resumeTimer", () => {
      this.handleResumeTimer();
    });

    socket.on("codeCrushers-requestCurrentState", () => {
      this.handleRequestCurrentState(socket);
    });
  }

  /**
   * Handle start challenge event
   * @param {Object} data - Challenge data
   */
  handleStartChallenge(data) {
    const { challengeType = 'algorithm', difficulty = 'medium', allocatedTime = 300 } = data;
    console.log(`Code Crushers: Starting ${difficulty} ${challengeType} challenge`);
    
    const challengeData = {
      challengeType,
      difficulty,
      allocatedTime: parseInt(allocatedTime), // Default 5 minutes
      roomName: this.roomName
    };

    this.timer.startTimer(challengeData);

    this.io.to(this.roomName).emit("codeCrushers-challengeStarted", {
      challengeType,
      difficulty,
      allocatedTime: challengeData.allocatedTime,
      startTime: Date.now()
    });
  }

  /**
   * Handle stop challenge event
   */
  handleStopChallenge() {
    console.log('Code Crushers: Stopping current challenge');
    this.timer.stopTimer();
  }

  /**
   * Handle pause timer event
   */
  handlePauseTimer() {
    console.log('Code Crushers: Pausing timer');
    this.timer.pauseTimer();
    this.io.to(this.roomName).emit("codeCrushers-timerPaused");
  }

  /**
   * Handle resume timer event
   */
  handleResumeTimer() {
    console.log('Code Crushers: Resuming timer');
    this.timer.resumeTimer();
    this.io.to(this.roomName).emit("codeCrushers-timerResumed");
  }

  /**
   * Handle request for current state (for reconnection)
   * @param {Object} socket - Individual socket connection
   */
  handleRequestCurrentState(socket) {
    const currentChallengeData = this.timer.getCurrentQuestionData();
    
    socket.emit("codeCrushers-currentState", {
      isActive: this.timer.isTimerActive(),
      isChallengeActive: currentChallengeData !== null,
      currentData: currentChallengeData
    });
  }
}

// Create and export a single instance
const codeCrushersHandler = new CodeCrushersHandler();

export default codeCrushersHandler;
