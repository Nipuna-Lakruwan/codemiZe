import GameTimer from "../gameTimer.js";

/**
 * Battle Breakers Socket Handler
 * 
 * This file handles all socket events and timer functionality specific to Battle Breakers game.
 * 
 * Events handled:
 * - battleBreakers-startQuestion: Start a new question with timer
 * - battleBreakers-stopQuestion: Stop current question and timer
 * - battleBreakers-requestCurrentState: Send current game state to reconnecting clients
 * 
 * Events emitted:
 * - battleBreakers-startQuestionclient: Question started for clients
 * - battleBreakers-timerUpdate: Timer countdown updates
 * - battleBreakers-timeUp: Timer expired
 * - battleBreakers-timerStopped: Timer manually stopped
 * - battleBreakers-syncTimer: Timer sync for reconnecting clients
 * - battleBreakers-currentState: Current game state
 */

class BattleBreakersHandler {
  constructor() {
    this.timer = new GameTimer('battleBreakers');
    this.roomName = 'battleBreakers';
    this.io = null;
  }

  /**
   * Initialize the handler with socket.io instance
   * @param {Object} io - Socket.io instance
   */
  initialize(io) {
    this.io = io;
    this.timer.setSocketInstance(io);
    console.log('Battle Breakers handler initialized');
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

    // Join the Battle Breakers room
    socket.join(this.roomName);
    console.log(`Battle Breakers client joined - Role: ${socket.user.role}`);

    // Send current question and timer state to newly connected client
    this.syncClientState(socket);

    // Register event listeners for this client
    this.registerEventListeners(socket);
  }

  /**
   * Sync current game state with a reconnecting client
   * @param {Object} socket - Individual socket connection
   */
  syncClientState(socket) {
    const currentQuestionData = this.timer.getCurrentQuestionData();
    
    if (currentQuestionData && this.timer.isTimerActive()) {
      console.log(`Syncing Battle Breakers state for new client (${socket.user.role}): ${currentQuestionData.timeRemaining}s remaining`);
      
      // Send both the question start event and timer sync for reconnecting clients
      socket.emit("battleBreakers-startQuestionclient", {
        _id: currentQuestionData._id,
        question: currentQuestionData.question,
        startTime: currentQuestionData.startTime,
        allocatedTime: currentQuestionData.allocatedTime,
        questionNo: currentQuestionData.questionNo,
        isReconnect: true // Flag to indicate this is a reconnection
      });
      
      // Sync timer with the client
      this.timer.syncTimerWithClient(socket);
    }
  }

  /**
   * Register all event listeners for Battle Breakers
   * @param {Object} socket - Individual socket connection
   */
  registerEventListeners(socket) {
    // Start question event
    socket.on("battleBreakers-startQuestion", (data) => {
      this.handleStartQuestion(data);
    });

    // Stop question event
    socket.on("battleBreakers-stopQuestion", (data) => {
      this.handleStopQuestion(data);
    });

    // Request current state (for reconnection)
    socket.on("battleBreakers-requestCurrentState", () => {
      this.handleRequestCurrentState(socket);
    });
  }

  /**
   * Handle start question event
   * @param {Object} data - Question data
   */
  handleStartQuestion(data) {
    const { _id, question, allocatedTime, questionNo } = data;
    console.log(`Battle Breakers: Starting question ${questionNo}: ${question}`);
    
    const questionData = {
      _id,
      question,
      allocatedTime: parseInt(allocatedTime),
      questionNo,
      roomName: this.roomName
    };

    // Start the synchronized timer
    this.timer.startTimer(questionData);

    // Emit to all clients including the question data
    this.io.to(this.roomName).emit("battleBreakers-startQuestionclient", {
      _id,
      question,
      startTime: Date.now(),
      allocatedTime: parseInt(allocatedTime),
      questionNo,
    });
  }

  /**
   * Handle stop question event
   * @param {Object} data - Stop question data
   */
  handleStopQuestion(data) {
    console.log(`Battle Breakers: Stopping question ${data.questionNo || 'current'}`);
    // Stop the synchronized timer
    this.timer.stopTimer();
  }

  /**
   * Handle request for current state (for reconnection)
   * @param {Object} socket - Individual socket connection
   */
  handleRequestCurrentState(socket) {
    const userId = socket.user?.id;
    console.log(`Battle Breakers: User ${userId} requested current state`);
    
    const currentQuestionData = this.timer.getCurrentQuestionData();
    
    // Send current timer state
    socket.emit("battleBreakers-currentState", {
      timer: this.timer.isTimerActive(),
      isActive: this.timer.isTimerActive(),
      isQuestionActive: currentQuestionData !== null
    });

    // If there's an active question, send the question data
    if (currentQuestionData) {
      console.log(`Battle Breakers: Sending current question data to reconnecting user: ${currentQuestionData.questionNo}`);
      socket.emit("battleBreakers-startQuestionclient", {
        _id: currentQuestionData._id,
        question: currentQuestionData.question,
        startTime: Date.now() - (currentQuestionData.elapsedTime * 1000),
        allocatedTime: currentQuestionData.allocatedTime,
        questionNo: currentQuestionData.questionNo,
        totalTime: currentQuestionData.allocatedTime,
        questionData: currentQuestionData
      });
    }
  }

  /**
   * Get current question data (for backward compatibility)
   * @returns {Object|null} Current question data
   */
  getCurrentQuestionData() {
    return this.timer.getCurrentQuestionData();
  }

  /**
   * Check if timer is active (for backward compatibility)
   * @returns {boolean} Timer active status
   */
  isTimerActive() {
    return this.timer.isTimerActive();
  }

  /**
   * Start timer (for backward compatibility and external access)
   * @param {Object} questionData - Question data
   */
  startTimer(questionData) {
    this.timer.startTimer({
      ...questionData,
      roomName: this.roomName
    });
  }

  /**
   * Stop timer (for backward compatibility and external access)
   */
  stopTimer() {
    this.timer.stopTimer();
  }
}

// Create and export a single instance
const battleBreakersHandler = new BattleBreakersHandler();

export default battleBreakersHandler;

// Legacy exports for backward compatibility (if needed elsewhere)
export const startBattleBreakersTimer = (questionData) => {
  battleBreakersHandler.startTimer(questionData);
};

export const stopBattleBreakersTimer = () => {
  battleBreakersHandler.stopTimer();
};
