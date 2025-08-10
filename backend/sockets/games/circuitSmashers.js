import GameTimer from "../gameTimer.js";

/**
 * Circuit Smashers Socket Handler
 * 
 * This file handles all socket events and timer functionality specific to Circuit Smashers game.
 * 
 * Events handled:
 * - circuitSmashers-startRound: Start a new circuit round with timer
 * - circuitSmashers-stopRound: Stop current round and timer
 * - circuitSmashers-pauseRound: Pause the current timer
 * - circuitSmashers-resumeRound: Resume the paused timer
 * - circuitSmashers-requestCurrentState: Send current game state to reconnecting clients
 * 
 * Events emitted:
 * - circuitSmashers-roundStarted: Round started for clients
 * - circuitSmashers-timerUpdate: Timer countdown updates
 * - circuitSmashers-timeUp: Timer expired
 * - circuitSmashers-timerStopped: Timer manually stopped
 * - circuitSmashers-syncTimer: Timer sync for reconnecting clients
 */

class CircuitSmashersHandler {
  constructor() {
    this.timer = new GameTimer('circuitSmashers');
    this.roomName = 'circuitSmashers';
    this.io = null;
  }

  /**
   * Initialize the handler with socket.io instance
   * @param {Object} io - Socket.io instance
   */
  initialize(io) {
    this.io = io;
    this.timer.setSocketInstance(io);
    console.log('Circuit Smashers handler initialized');
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

    // Join the Circuit Smashers room
    socket.join(this.roomName);
    console.log(`Circuit Smashers client joined - Role: ${socket.user.role}`);

    // Send current round and timer state to newly connected client
    this.syncClientState(socket);

    // Register event listeners for this client
    this.registerEventListeners(socket);
  }

  /**
   * Sync current game state with a reconnecting client
   * @param {Object} socket - Individual socket connection
   */
  syncClientState(socket) {
    const currentRoundData = this.timer.getCurrentQuestionData();
    
    if (currentRoundData && this.timer.isTimerActive()) {
      console.log(`Syncing Circuit Smashers state: ${currentRoundData.timeRemaining}s remaining`);
      
      socket.emit("circuitSmashers-roundStarted", {
        roundNo: currentRoundData.roundNo,
        circuit: currentRoundData.circuit,
        difficulty: currentRoundData.difficulty,
        allocatedTime: currentRoundData.allocatedTime,
        isReconnect: true
      });
      
      this.timer.syncTimerWithClient(socket);
    }
  }

  /**
   * Register all event listeners for Circuit Smashers
   * @param {Object} socket - Individual socket connection
   */
  registerEventListeners(socket) {
    socket.on("circuitSmashers-startRound", (data) => {
      this.handleStartRound(data);
    });

    socket.on("circuitSmashers-stopRound", () => {
      this.handleStopRound();
    });

    socket.on("circuitSmashers-pauseRound", () => {
      this.handlePauseRound();
    });

    socket.on("circuitSmashers-resumeRound", () => {
      this.handleResumeRound();
    });

    socket.on("circuitSmashers-requestCurrentState", () => {
      this.handleRequestCurrentState(socket);
    });
  }

  /**
   * Handle start round event
   * @param {Object} data - Round data
   */
  handleStartRound(data) {
    const { allocatedTime = 1800 } = data;
    
    console.log(`Circuit Smashers: Starting round`);
    
    const roundData = {
      allocatedTime: parseInt(allocatedTime),
      roomName: this.roomName
    };

    this.timer.startTimer(roundData);

    this.io.to(this.roomName).emit("circuitSmashers-roundStarted", {
      allocatedTime: roundData.allocatedTime,
      startTime: Date.now()
    });
  }

  /**
   * Handle stop round event
   */
  handleStopRound() {
    console.log('Circuit Smashers: Stopping current round');
    this.timer.stopTimer();
  }

  /**
   * Handle pause round event
   */
  handlePauseRound() {
    console.log('Circuit Smashers: Pausing round');
    this.timer.pauseTimer();
    this.io.to(this.roomName).emit("circuitSmashers-roundPaused");
  }

  /**
   * Handle resume round event
   */
  handleResumeRound() {
    console.log('Circuit Smashers: Resuming round');
    this.timer.resumeTimer();
    this.io.to(this.roomName).emit("circuitSmashers-roundResumed");
  }

  /**
   * Handle request for current state (for reconnection)
   * @param {Object} socket - Individual socket connection
   */
  handleRequestCurrentState(socket) {
    const currentRoundData = this.timer.getCurrentQuestionData();
    
    socket.emit("circuitSmashers-currentState", {
      isActive: this.timer.isTimerActive(),
      isRoundActive: currentRoundData !== null,
      currentData: currentRoundData
    });
  }
}

// Create and export a single instance
const circuitSmashersHandler = new CircuitSmashersHandler();

export default circuitSmashersHandler;
