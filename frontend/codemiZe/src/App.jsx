/**
 * CodemiZe - Main Application
 * 
 * This file serves as the entry point for the CodemiZe application.
 * It defines the routing structure and layout for the entire app.
 * 
 * Structure:
 * - Public routes (login)
 * - Protected student routes (games roadmap, individual games)
 * - Protected admin routes (dashboard, game management, user management)
 */

import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import GamesRoadmap from './pages/Student/GamesRoadmap';
import { ProtectedRoute } from './components/ProtectedRoute';

// Import all game pages
import QuizHunters from './pages/Student/QuizHunters/QuizHunters';
import CodeCrushers from './pages/Student/CodeCrushers/CodeCrushers';
import CircuitSmashers from './pages/Student/CircuitSmashers/CircuitSmashers';
import RouteSeekers from './pages/Student/RouteSeekers/RouteSeekers';
import BattleBreakers from './pages/Student/BattleBreakers/BattleBreakers';
import Winners from './pages/Student/Winners/Winners';
import BuzzerDashboard from './pages/Admin/Dashboard/BattleBreakers/BuzzerDashboard';

// Admin pages
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import MarkingCriterias from './pages/Admin/MarkingCriterias/MarkingCriterias';
import AdminQuizHunters from './pages/Admin/QuizHunters/AdminQuizHunters';
import AdminCodeCrushers from './pages/Admin/CodeCrushers/AdminCodeCrushers';
import AdminCircuitSmashers from './pages/Admin/CircuitSmashers/AdminCircuitSmashers';
import AdminRouteSeekers from './pages/Admin/RouteSeekers/AdminRouteSeekers';
import AdminBattleBreakers from './pages/Admin/BattleBreakers/AdminBattleBreakers';
import UserManagement from './pages/Admin/UserManagement/UserManagement';

/**
 * Router Configuration
 * 
 * This defines all routes for the application, organized by section:
 * - Public routes (login)
 * - Student routes (games and related pages)
 * - Admin routes (dashboard and management pages)
 * 
 * All protected routes are wrapped with the ProtectedRoute component
 * which handles authentication checking.
 */
/**
 * Main App component
 * 
 * Applies the global layout with background image and dark overlay
 * Renders the routes which manages all application routes
 * 
 * @returns {JSX.Element} The App component
 */
function App() {
  return (
    <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed relative overflow-hidden"
      style={{ backgroundImage: "url('/background.jpg')" }}>
      {/* Dark overlay layer for better content visibility */}
      <div className="min-h-screen w-full bg-black/70 relative z-10">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />

          {/* Student routes */}
          <Route path="/student/games-roadmap" element={<ProtectedRoute><GamesRoadmap /></ProtectedRoute>} />
          <Route path="/student/quiz-hunters" element={<ProtectedRoute><QuizHunters /></ProtectedRoute>} />
          <Route path="/student/code-crushers" element={<ProtectedRoute><CodeCrushers /></ProtectedRoute>} />
          <Route path="/student/circuit-smashers" element={<ProtectedRoute><CircuitSmashers /></ProtectedRoute>} />
          <Route path="/student/route-seekers" element={<ProtectedRoute><RouteSeekers /></ProtectedRoute>} />
          <Route path="/student/battle-breakers" element={<ProtectedRoute><BattleBreakers /></ProtectedRoute>} />
          <Route path="/student/winners" element={<ProtectedRoute><Winners /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin/marking-criterias" element={<ProtectedRoute><MarkingCriterias /></ProtectedRoute>} />
          <Route path="/admin/quiz-hunters" element={<ProtectedRoute><AdminQuizHunters /></ProtectedRoute>} />
          <Route path="/admin/code-crushers" element={<ProtectedRoute><AdminCodeCrushers /></ProtectedRoute>} />
          <Route path="/admin/circuit-smashers" element={<ProtectedRoute><AdminCircuitSmashers /></ProtectedRoute>} />
          <Route path="/admin/route-seekers" element={<ProtectedRoute><AdminRouteSeekers /></ProtectedRoute>} />
          <Route path="/admin/battle-breakers" element={<ProtectedRoute><AdminBattleBreakers /></ProtectedRoute>} />
          <Route path="/admin/user-management" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/dashboard/battle-breakers" element={<ProtectedRoute><BuzzerDashboard /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;