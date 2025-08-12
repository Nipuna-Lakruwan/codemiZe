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

  initialize(io) {
    this.io = io;
    this.timer.setSocketInstance(io);
  }

  initializeClient(socket, io) {
    if (!this.io) {
      this.initialize(io);
    }

    // Join the Circuit Smashers room
    socket.join(this.roomName);

    // Send current round and timer state to newly connected client
    this.syncClientState(socket);

    // Register event listeners for this client
    this.registerEventListeners(socket);
  }

  syncClientState(socket) {
    const currentRoundData = this.timer.getCurrentQuestionData();
    
    if (currentRoundData && this.timer.isTimerActive()) {
      
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

  handleStartRound(data) {
    const { allocatedTime = 1800 } = data;
    
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

  handleStopRound() {
    this.timer.stopTimer();
  }

  handlePauseRound() {
    this.timer.pauseTimer();
    this.io.to(this.roomName).emit("circuitSmashers-roundPaused");
  }

  handleResumeRound() {
    this.timer.resumeTimer();
    this.io.to(this.roomName).emit("circuitSmashers-roundResumed");
  }

  handleRequestCurrentState(socket) {
    const currentRoundData = this.timer.getCurrentQuestionData();
    
    socket.emit("circuitSmashers-currentState", {
      isActive: this.timer.isTimerActive(),
      isRoundActive: currentRoundData !== null,
      currentData: currentRoundData
    });
  }
}

const circuitSmashersHandler = new CircuitSmashersHandler();

export default circuitSmashersHandler;