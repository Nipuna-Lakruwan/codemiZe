import socketAuth from "../middleware/socketAuth.js";

const setupSocket = (io, app) => {
  const onlineUsers = app.get("onlineUsers");

  // Timer management for Battle Breakers
  let battleBreakersTimer = null;
  let currentQuestionData = null;

  const startBattleBreakersTimer = (questionData) => {
    // Clear any existing timer
    if (battleBreakersTimer) {
      clearInterval(battleBreakersTimer);
      battleBreakersTimer = null;
    }

    const startTime = Date.now();
    currentQuestionData = { ...questionData, startTime };
    let timeRemaining = questionData.allocatedTime;

    //console.log(`Starting Battle Breakers timer for ${timeRemaining} seconds`);

    // Start the server-side timer
    battleBreakersTimer = setInterval(() => {
      timeRemaining--;
      
      // Broadcast timer update to all connected clients
      io.to("battleBreakers").emit("battleBreakers-timerUpdate", {
        timeRemaining,
        questionId: questionData._id,
        totalTime: questionData.allocatedTime
      });

      //console.log(`Timer update: ${timeRemaining}s remaining`);

      // If time is up, stop the timer and notify clients
      if (timeRemaining <= 0) {
        //console.log('Timer finished - notifying clients');
        clearInterval(battleBreakersTimer);
        battleBreakersTimer = null;
        io.to("battleBreakers").emit("battleBreakers-timeUp", {
          questionId: questionData._id
        });
      }
    }, 1000);
  };

  const stopBattleBreakersTimer = () => {
    //console.log('Stopping Battle Breakers timer');
    if (battleBreakersTimer) {
      clearInterval(battleBreakersTimer);
      battleBreakersTimer = null;
    }
    // Notify all clients that the timer has stopped
    io.to("battleBreakers").emit("battleBreakers-timerStopped", {
      questionId: currentQuestionData?._id
    });
    // Reset current question data
    currentQuestionData = null;
  };

  socketAuth(io);

  io.on("connection", (socket) => {
    const userId = socket.user?.id;

    if (!userId) {
      console.error("User not authenticated.");
      return;
    }

    console.log(`User connected: ${userId}`);
    onlineUsers.set(userId, socket.id);

    if (socket.user.role === "Dashboard") {
      socket.join("scoreboard");
      console.log("Scoreboard client joined");
    }

    if (socket.user.role === "School" || socket.user.role === "Dashboard" || socket.user.role === "Admin") {
      socket.join("battleBreakers");
      //console.log(`BattleBreakers client joined - Role: ${socket.user.role}`);
      
      // Send current question and timer state to newly connected client if a question is active
      if (currentQuestionData && battleBreakersTimer) {
        const elapsedTime = Math.floor((Date.now() - currentQuestionData.startTime) / 1000);
        const timeRemaining = Math.max(0, currentQuestionData.allocatedTime - elapsedTime);
        
        //console.log(`Syncing question and timer for new client (${socket.user.role}): ${timeRemaining}s remaining`);
        
        // Send both the question start event and timer sync for reconnecting clients
        socket.emit("battleBreakers-startQuestionclient", {
          _id: currentQuestionData._id,
          question: currentQuestionData.question,
          startTime: currentQuestionData.startTime,
          allocatedTime: currentQuestionData.allocatedTime,
          questionNo: currentQuestionData.questionNo,
          isReconnect: true // Flag to indicate this is a reconnection
        });
        
        // Also send timer sync for accurate timer state
        socket.emit("battleBreakers-syncTimer", {
          timeRemaining,
          questionId: currentQuestionData._id,
          totalTime: currentQuestionData.allocatedTime,
          questionData: currentQuestionData
        });
      }
    }

    socket.on("battleBreakers-startQuestion", (data) => {
      const { _id, question, allocatedTime, questionNo } = data;
      //console.log(`Received start question event for question ${questionNo}: ${question}`);
      
      const questionData = {
        _id,
        question,
        allocatedTime: parseInt(allocatedTime),
        questionNo
      };

      // Start the synchronized timer
      startBattleBreakersTimer(questionData);

      // Emit to all clients including the question data
      io.to("battleBreakers").emit("battleBreakers-startQuestionclient", {
        _id,
        question,
        startTime: Date.now(),
        allocatedTime: parseInt(allocatedTime),
        questionNo,
      });
    });

    socket.on("battleBreakers-stopQuestion", (data) => {
      //console.log(`Received stop question event for question ${data.questionNo}`);
      // Stop the synchronized timer
      stopBattleBreakersTimer();
    });

    // Handle request for current state (for reconnection)
    socket.on("battleBreakers-requestCurrentState", () => {
      // console.log(`User ${userId} requested current battle breakers state`);
      
      // Send current timer state
      socket.emit("battleBreakers-currentState", {
        timer: battleBreakersTimer,
        isActive: battleBreakersTimerActive,
        isQuestionActive: currentQuestionData !== null
      });

      // If there's an active question, send the question data
      if (currentQuestionData) {
        //console.log(`Sending current question data to reconnecting user: ${currentQuestionData.questionNo}`);
        socket.emit("battleBreakers-startQuestionclient", {
          _id: currentQuestionData._id,
          question: currentQuestionData.question,
          startTime: Date.now() - (battleBreakersTimer * 1000),
          allocatedTime: currentQuestionData.allocatedTime,
          questionNo: currentQuestionData.questionNo,
          totalTime: currentQuestionData.allocatedTime,
          questionData: currentQuestionData
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
      onlineUsers.delete(userId.toString());
    });
  });
};

export default setupSocket;