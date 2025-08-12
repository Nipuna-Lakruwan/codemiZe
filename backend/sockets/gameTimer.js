/**
 * Reusable Game Timer Module
 * 
 * This module provides a generic timer functionality that can be used across all games.
 * It handles starting, stopping, and syncing timers for any game type.
 * 
 * How to use this module:
 * 
 * 1. Import the GameTimer class:
 *    import GameTimer from './gameTimer.js';
 * 
 * 2. Create a timer instance for your game:
 *    const myGameTimer = new GameTimer('myGameName');
 * 
 * 3. Set the socket.io instance (usually done once in setupSocket):
 *    myGameTimer.setSocketInstance(io);
 * 
 * 4. Start a timer for a question/round:
 *    myGameTimer.startTimer({
 *      _id: questionId,
 *      question: questionText,
 *      allocatedTime: 60, // seconds
 *      questionNo: 1,
 *      roomName: 'myGameRoom' // socket room name
 *    });
 * 
 * 5. Stop the timer:
 *    myGameTimer.stopTimer();
 * 
 * 6. Get current question data (useful for reconnections):
 *    const currentData = myGameTimer.getCurrentQuestionData();
 * 
 * 7. Check if timer is active:
 *    const isActive = myGameTimer.isTimerActive();
 * 
 * Events emitted to clients:
 * - `${gameName}-timerUpdate`: Sent every second with remaining time
 * - `${gameName}-timeUp`: Sent when timer reaches zero
 * - `${gameName}-timerStopped`: Sent when timer is manually stopped
 * - `${gameName}-syncTimer`: Sent to synchronize timer for reconnecting clients
 */

class GameTimer {

  constructor(gameName) {
    this.gameName = gameName;
    this.timer = null; // The setInterval timer instance
    this.currentQuestionData = null;
    this.ioInstance = null;
  }

  setSocketInstance(io) {
    this.ioInstance = io;
  }

  startTimer(questionData, additionalData = {}) {
    // Clear any existing timer
    this.stopTimer(false); // Don't emit stop event when starting new timer

    const startTime = Date.now();
    this.currentQuestionData = { 
      ...questionData, 
      ...additionalData,
      startTime 
    };
    
    let timeRemaining = questionData.allocatedTime;

    console.log(`Starting ${this.gameName} timer for ${timeRemaining} seconds`);

    // Start the server-side timer
    this.timer = setInterval(() => {
      timeRemaining--;
      
      // Broadcast timer update to all connected clients in the room
      if (this.ioInstance && questionData.roomName) {
        this.ioInstance.to(questionData.roomName).emit(`${this.gameName}-timerUpdate`, {
          timeRemaining,
          questionId: questionData._id,
          totalTime: questionData.allocatedTime,
          questionNo: questionData.questionNo
        });
      }

      // If time is up, stop the timer and notify clients
      if (timeRemaining <= 0) {
        console.log(`${this.gameName} timer finished - notifying clients`);
        this.clearTimer();
        
        if (this.ioInstance && questionData.roomName) {
          this.ioInstance.to(questionData.roomName).emit(`${this.gameName}-timeUp`, {
            questionId: questionData._id,
            questionNo: questionData.questionNo
          });
        }
      }
    }, 1000);
  }

  stopTimer(emitStopEvent = true) {
    console.log(`Stopping ${this.gameName} timer`);
    
    if (this.timer) {
      this.clearTimer();
      
      // Notify all clients that the timer has stopped
      if (emitStopEvent && this.ioInstance && this.currentQuestionData?.roomName) {
        this.ioInstance.to(this.currentQuestionData.roomName).emit(`${this.gameName}-timerStopped`, {
          questionId: this.currentQuestionData._id,
          questionNo: this.currentQuestionData.questionNo
        });
      }
    }
    
    // Reset current question data
    this.currentQuestionData = null;
  }

  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  getCurrentQuestionData() {
    if (!this.currentQuestionData || !this.timer) {
      return null;
    }

    const elapsedTime = Math.floor((Date.now() - this.currentQuestionData.startTime) / 1000);
    const timeRemaining = Math.max(0, this.currentQuestionData.allocatedTime - elapsedTime);

    return {
      ...this.currentQuestionData,
      timeRemaining,
      elapsedTime
    };
  }

  getCurrentData() {
    return this.getCurrentQuestionData();
  }

  syncTimerWithClient(socket) {
    const currentData = this.getCurrentQuestionData();
    
    if (currentData && currentData.timeRemaining > 0) {
      console.log(`Syncing ${this.gameName} timer for reconnecting client: ${currentData.timeRemaining}s remaining`);
      
      // Send timer sync event to the specific client
      socket.emit(`${this.gameName}-syncTimer`, {
        timeRemaining: currentData.timeRemaining,
        questionId: currentData._id,
        totalTime: currentData.allocatedTime,
        questionNo: currentData.questionNo,
        questionData: currentData,
        isReconnect: true
      });
    }
  }

  isTimerActive() {
    return this.timer !== null;
  }

  getRemainingTime() {
    const currentData = this.getCurrentQuestionData();
    return currentData ? currentData.timeRemaining : null;
  }

  pauseTimer() {
    if (this.timer) {
      console.log(`Pausing ${this.gameName} timer`);
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  resumeTimer(roomName) {
    if (!this.currentQuestionData || this.timer) {
      return; // No question data to resume or timer already running
    }

    const currentData = this.getCurrentQuestionData();
    if (currentData && currentData.timeRemaining > 0) {
      console.log(`Resuming ${this.gameName} timer with ${currentData.timeRemaining}s remaining`);
      
      // Update the start time to account for the time already elapsed
      this.currentQuestionData.startTime = Date.now() - (currentData.elapsedTime * 1000);
      
      // Restart timer with remaining time
      let timeRemaining = currentData.timeRemaining;
      
      this.timer = setInterval(() => {
        timeRemaining--;
        
        if (this.ioInstance && roomName) {
          this.ioInstance.to(roomName).emit(`${this.gameName}-timerUpdate`, {
            timeRemaining,
            questionId: this.currentQuestionData._id,
            totalTime: this.currentQuestionData.allocatedTime,
            questionNo: this.currentQuestionData.questionNo
          });
        }

        if (timeRemaining <= 0) {
          console.log(`${this.gameName} timer finished after resume - notifying clients`);
          this.clearTimer();
          
          if (this.ioInstance && roomName) {
            this.ioInstance.to(roomName).emit(`${this.gameName}-timeUp`, {
              questionId: this.currentQuestionData._id,
              questionNo: this.currentQuestionData.questionNo
            });
          }
        }
      }, 1000);
    }
  }
}

export default GameTimer;