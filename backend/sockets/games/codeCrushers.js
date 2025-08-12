import GameTimer from "../gameTimer.js";

/**
 * Code Crushers Socket Handler
 * 
 * This file handles all socket events and timer functionality specific to Code Crushers game.
 * 
 * Events handled:
 * - codeCrushers-startRound: Start a new coding round with timer
 * - codeCrushers-stopRound: Stop current round and timer
 * - codeCrushers-pauseRound: Pause the current round
 * - codeCrushers-resumeRound: Resume the paused round
 * - codeCrushers-requestCurrentState: Send current game state to reconnecting clients
 * 
 * Events emitted:
 * - codeCrushers-roundStarted: Round started for clients
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

  initialize(io) {
    this.io = io;
    this.timer.setSocketInstance(io);
  }

  initializeClient(socket, io) {
    if (!this.io) {
      this.initialize(io);
    }

    // Join the Code Crushers room
    socket.join(this.roomName);

    // Send current challenge and timer state to newly connected client
    this.syncClientState(socket);
    this.registerEventListeners(socket);
  }

  syncClientState(socket) {
    const currentChallengeData = this.timer.getCurrentQuestionData();
    
    if (currentChallengeData && this.timer.isTimerActive()) {
      socket.emit("codeCrushers-challengeStarted", {
        challengeType: currentChallengeData.challengeType,
        difficulty: currentChallengeData.difficulty,
        allocatedTime: currentChallengeData.allocatedTime,
        isReconnect: true
      });
      
      this.timer.syncTimerWithClient(socket);
    }
  }

  registerEventListeners(socket) {
    socket.on("codeCrushers-startRound", (data) => {
      this.handleStartChallenge(data);
    });

    socket.on("codeCrushers-stopRound", () => {
      this.handleStopChallenge();
    });

    socket.on("codeCrushers-pauseRound", () => {
      this.handlePauseTimer();
    });

    socket.on("codeCrushers-resumeRound", () => {
      this.handleResumeTimer();
    });

    socket.on("codeCrushers-requestCurrentState", () => {
      this.handleRequestCurrentState(socket);
    });
  }

  handleStartChallenge(data) {
    const { allocatedTime = 1800 } = data;

    const challengeData = {
      allocatedTime: parseInt(allocatedTime),
      roomName: this.roomName
    };

    this.timer.startTimer(challengeData);

    this.io.to(this.roomName).emit("codeCrushers-roundStarted", {
      allocatedTime: challengeData.allocatedTime,
      startTime: Date.now()
    });
  }

  handleStopChallenge() {
    this.timer.stopTimer();
  }

  handlePauseTimer() {
    this.timer.pauseTimer();
    this.io.to(this.roomName).emit("codeCrushers-timerPaused");
  }

  handleResumeTimer() {
    this.timer.resumeTimer();
    this.io.to(this.roomName).emit("codeCrushers-timerResumed");
  }

  handleRequestCurrentState(socket) {
    const currentChallengeData = this.timer.getCurrentQuestionData();
    
    socket.emit("codeCrushers-currentState", {
      isActive: this.timer.isTimerActive(),
      isChallengeActive: currentChallengeData !== null,
      currentData: currentChallengeData
    });
  }
}

const codeCrushersHandler = new CodeCrushersHandler();

export default codeCrushersHandler;