import GameTimer from "../gameTimer.js";

/**
 * Route Seekers Socket Handler
 * 
 * This file handles all socket events and timer functionality specific to Route Seekers game.
 * 
 * Events handled:
 * - routeSeekers-startNavigation: Start a new navigation challenge with timer
 * - routeSeekers-stopNavigation: Stop current navigation and timer
 * - routeSeekers-requestProgress: Get current route progress
 * - routeSeekers-requestCurrentState: Send current game state to reconnecting clients
 * 
 * Events emitted:
 * - routeSeekers-navigationStarted: Navigation started for clients
 * - routeSeekers-timerUpdate: Timer countdown updates
 * - routeSeekers-timeUp: Timer expired
 * - routeSeekers-timerStopped: Timer manually stopped
 * - routeSeekers-syncTimer: Timer sync for reconnecting clients
 * - routeSeekers-progressUpdate: Current progress update
 */

class RouteSeekersHandler {
  constructor() {
    this.timer = new GameTimer('routeSeekers');
    this.roomName = 'routeSeekers';
    this.io = null;
  }

  /**
   * Initialize the handler with socket.io instance
   * @param {Object} io - Socket.io instance
   */
  initialize(io) {
    this.io = io;
    this.timer.setSocketInstance(io);
    console.log('Route Seekers handler initialized');
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

    // Join the Route Seekers room
    socket.join(this.roomName);
    console.log(`Route Seekers client joined - Role: ${socket.user.role}`);

    // Send current navigation and timer state to newly connected client
    this.syncClientState(socket);

    // Register event listeners for this client
    this.registerEventListeners(socket);
  }

  /**
   * Sync current game state with a reconnecting client
   * @param {Object} socket - Individual socket connection
   */
  syncClientState(socket) {
    const currentNavigationData = this.timer.getCurrentQuestionData();
    
    if (currentNavigationData && this.timer.isTimerActive()) {
      console.log(`Syncing Route Seekers state: ${currentNavigationData.timeRemaining}s remaining`);
      
      socket.emit("routeSeekers-navigationStarted", {
        routeNo: currentNavigationData.routeNo,
        startPoint: currentNavigationData.startPoint,
        endPoint: currentNavigationData.endPoint,
        waypoints: currentNavigationData.waypoints,
        allocatedTime: currentNavigationData.allocatedTime,
        isReconnect: true
      });
      
      this.timer.syncTimerWithClient(socket);
    }
  }

  /**
   * Register all event listeners for Route Seekers
   * @param {Object} socket - Individual socket connection
   */
  registerEventListeners(socket) {
    socket.on("routeSeekers-startNavigation", (data) => {
      this.handleStartNavigation(data);
    });

    socket.on("routeSeekers-stopNavigation", () => {
      this.handleStopNavigation();
    });

    socket.on("routeSeekers-requestProgress", () => {
      this.handleRequestProgress(socket);
    });

    socket.on("routeSeekers-requestCurrentState", () => {
      this.handleRequestCurrentState(socket);
    });
  }

  /**
   * Handle start navigation event
   * @param {Object} data - Navigation data
   */
  handleStartNavigation(data) {
    const { 
      routeNo = 1,
      startPoint = 'A',
      endPoint = 'Z',
      waypoints = [],
      allocatedTime = 180,
      mapSize = 'medium'
    } = data;
    
    console.log(`Route Seekers: Starting route ${routeNo} from ${startPoint} to ${endPoint}`);
    
    const navigationData = {
      routeNo,
      startPoint,
      endPoint,
      waypoints,
      mapSize,
      allocatedTime: parseInt(allocatedTime), // Default 3 minutes
      roomName: this.roomName
    };

    this.timer.startTimer(navigationData);

    this.io.to(this.roomName).emit("routeSeekers-navigationStarted", {
      routeNo,
      startPoint,
      endPoint,
      waypoints,
      mapSize,
      allocatedTime: navigationData.allocatedTime,
      startTime: Date.now()
    });
  }

  /**
   * Handle stop navigation event
   */
  handleStopNavigation() {
    console.log('Route Seekers: Stopping current navigation');
    this.timer.stopTimer();
  }

  /**
   * Handle request progress event
   * @param {Object} socket - Individual socket connection
   */
  handleRequestProgress(socket) {
    const currentData = this.timer.getCurrentQuestionData();
    
    if (currentData) {
      socket.emit("routeSeekers-progressUpdate", {
        timeRemaining: currentData.timeRemaining,
        elapsedTime: currentData.elapsedTime,
        totalTime: currentData.allocatedTime,
        routeData: currentData
      });
    } else {
      socket.emit("routeSeekers-progressUpdate", {
        timeRemaining: 0,
        elapsedTime: 0,
        totalTime: 0,
        routeData: null
      });
    }
  }

  /**
   * Handle request for current state (for reconnection)
   * @param {Object} socket - Individual socket connection
   */
  handleRequestCurrentState(socket) {
    const currentNavigationData = this.timer.getCurrentQuestionData();
    
    socket.emit("routeSeekers-currentState", {
      isActive: this.timer.isTimerActive(),
      isNavigationActive: currentNavigationData !== null,
      currentData: currentNavigationData
    });
  }
}

// Create and export a single instance
const routeSeekersHandler = new RouteSeekersHandler();

export default routeSeekersHandler;
