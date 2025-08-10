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

  initialize(io) {
    this.io = io;
    this.timer.setSocketInstance(io);
    console.log('Battle Breakers handler initialized');
  }

  initializeClient(socket, io) {
    if (!this.io) {
      this.initialize(io);
    }

    // Join the Battle Breakers room
    socket.join(this.roomName);
    // console.log(`Battle Breakers client joined - Role: ${socket.user.role}`);

    // Send current question and timer state to newly connected client
    this.syncClientState(socket);
    this.registerEventListeners(socket);
  }

  syncClientState(socket) {
    const currentQuestionData = this.timer.getCurrentQuestionData();
    
    if (currentQuestionData && this.timer.isTimerActive()) {
      // console.log(`Syncing Battle Breakers state for new client (${socket.user.role}): ${currentQuestionData.timeRemaining}s remaining`);
      
      // Send both the question start event and timer sync for reconnecting clients
      socket.emit("battleBreakers-startQuestionclient", {
        _id: currentQuestionData._id,
        question: currentQuestionData.question,
        startTime: currentQuestionData.startTime,
        allocatedTime: currentQuestionData.allocatedTime,
        questionNo: currentQuestionData.questionNo,
        isReconnect: true
      });
      
      // Sync timer with the client
      this.timer.syncTimerWithClient(socket);
    }
  }

  registerEventListeners(socket) {
    socket.on("battleBreakers-startQuestion", (data) => {
      this.handleStartQuestion(data);
    });

    socket.on("battleBreakers-stopQuestion", (data) => {
      this.handleStopQuestion(data);
    });

    // Request current state (for reconnection)
    socket.on("battleBreakers-requestCurrentState", () => {
      this.handleRequestCurrentState(socket);
    });
  }

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

  handleStopQuestion(data) {
    console.log(`Battle Breakers: Stopping question ${data.questionNo || 'current'}`);
    // Stop the synchronized timer
    this.timer.stopTimer();
  }

  handleRequestCurrentState(socket) {
    const currentQuestionData = this.timer.getCurrentQuestionData();
    
    // Send current timer state
    socket.emit("battleBreakers-currentState", {
      timer: this.timer.isTimerActive(),
      isActive: this.timer.isTimerActive(),
      isQuestionActive: currentQuestionData !== null
    });

    // If there's an active question, send the question data
    if (currentQuestionData) {
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

  getCurrentQuestionData() {
    return this.timer.getCurrentQuestionData();
  }

  isTimerActive() {
    return this.timer.isTimerActive();
  }

  startTimer(questionData) {
    this.timer.startTimer({
      ...questionData,
      roomName: this.roomName
    });
  }

  stopTimer() {
    this.timer.stopTimer();
  }
}


const battleBreakersHandler = new BattleBreakersHandler();

export default battleBreakersHandler;