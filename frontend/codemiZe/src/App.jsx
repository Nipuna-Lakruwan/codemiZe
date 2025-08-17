/**
 * CodemiZe - Main Application
 * 
 * This file serves as the entry point for the CodemiZe application.
 * It defines the routing structure and layout for the entire app.
 * 
 * Structure:
 * - Public routes (login)
 * - Protected student routes (games roadmap, individual games)
 * - Protected judge routes (judging interface for each game)
 * - Protected admin routes (dashboard, game management, user management)
 */

import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import GamesRoadmap from './pages/Student/GamesRoadmap';
import { RoleProtectedRoute } from './routeProtection/RoleProtectedRoute';
import { ROLES, ROUTE_PERMISSIONS } from './utils/roleConstants';

// Import all game pages
import QuizHunters from './pages/Student/QuizHunters/QuizHunters';
import CodeCrushers from './pages/Student/CodeCrushers/CodeCrushers';
import CircuitSmashers from './pages/Student/CircuitSmashers/CircuitSmashers';
import RouteSeekers from './pages/Student/RouteSeekers/RouteSeekers';
import BattleBreakers from './pages/Student/BattleBreakers/BattleBreakers';
import Winners from './pages/Student/Winners/Winners';
import BuzzerDashboard from './pages/Admin/Dashboard/BattleBreakers/BuzzerDashboard';
import TimerDashboard from './pages/Admin/Dashboard/TimerDashboard';

// Import judge pages
import JudgeDashboard from './pages/Judge/JudgeDashboard';
import QuizHuntersJudge from './pages/Judge/QuizHunters/QuizHuntersJudge';
import CodeCrushersJudge from './pages/Judge/CodeCrushers/CodeCrushersJudge';
import CircuitSmashersJudge from './pages/Judge/CircuitSmashers/CircuitSmashersJudge';
import RouteSeekersJudge from './pages/Judge/RouteSeekers/RouteSeekersJudge';
import BattleBreakersJudge from './pages/Judge/BattleBreakers/BattleBreakersJudge';

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

          {/* Student routes - only accessible by School role */}
          <Route path="/student/games-roadmap" element={
            <RoleProtectedRoute allowedRoles={ROUTE_PERMISSIONS.STUDENT_GAMES_ROADMAP}>
              <GamesRoadmap />
            </RoleProtectedRoute>
          } />
          <Route path="/student/quiz-hunters" element={
            <RoleProtectedRoute allowedRoles={ROUTE_PERMISSIONS.STUDENT_QUIZ_HUNTERS}>
              <QuizHunters />
            </RoleProtectedRoute>
          } />
          <Route path="/student/code-crushers" element={
            <RoleProtectedRoute allowedRoles={ROUTE_PERMISSIONS.STUDENT_CODE_CRUSHERS}>
              <CodeCrushers />
            </RoleProtectedRoute>
          } />
          <Route path="/student/circuit-smashers" element={
            <RoleProtectedRoute allowedRoles={ROUTE_PERMISSIONS.STUDENT_CIRCUIT_SMASHERS}>
              <CircuitSmashers />
            </RoleProtectedRoute>
          } />
          <Route path="/student/route-seekers" element={
            <RoleProtectedRoute allowedRoles={ROUTE_PERMISSIONS.STUDENT_ROUTE_SEEKERS}>
              <RouteSeekers />
            </RoleProtectedRoute>
          } />
          <Route path="/student/battle-breakers" element={
            <RoleProtectedRoute allowedRoles={ROUTE_PERMISSIONS.STUDENT_BATTLE_BREAKERS}>
              <BattleBreakers />
            </RoleProtectedRoute>
          } />
          <Route path="/student/winners" element={
            <RoleProtectedRoute allowedRoles={ROUTE_PERMISSIONS.STUDENT_WINNERS}>
              <Winners />
            </RoleProtectedRoute>
          } />

          {/* Judge routes - only accessible by Judge role */}
          <Route path="/judge/quiz-hunters" element={
            <RoleProtectedRoute allowedRoles={ROUTE_PERMISSIONS.JUDGE_MARKING}>
              <QuizHuntersJudge />
            </RoleProtectedRoute>
          } />
          <Route path="/judge/code-crushers" element={
            <RoleProtectedRoute allowedRoles={ROUTE_PERMISSIONS.JUDGE_MARKING}>
              <CodeCrushersJudge />
            </RoleProtectedRoute>
          } />
          <Route path="/judge/circuit-smashers" element={
            <RoleProtectedRoute allowedRoles={ROUTE_PERMISSIONS.JUDGE_MARKING}>
              <CircuitSmashersJudge />
            </RoleProtectedRoute>
          } />
          <Route path="/judge/route-seekers" element={
            <RoleProtectedRoute allowedRoles={ROUTE_PERMISSIONS.JUDGE_MARKING}>
              <RouteSeekersJudge />
            </RoleProtectedRoute>
          } />
          <Route path="/judge/battle-breakers" element={
            <RoleProtectedRoute allowedRoles={ROUTE_PERMISSIONS.JUDGE_MARKING}>
              <BattleBreakersJudge />
            </RoleProtectedRoute>
          } />

          {/* Admin routes - only accessible by Admin role */}
          <Route path="/admin/dashboard" element={
            <RoleProtectedRoute allowedRoles={ROUTE_PERMISSIONS.ADMIN_DASHBOARD}>
              <Dashboard />
            </RoleProtectedRoute>
          } />
          <Route path="/admin/marking-criterias" element={
            <RoleProtectedRoute allowedRoles={ROUTE_PERMISSIONS.ADMIN_MARKING_CRITERIAS}>
              <MarkingCriterias />
            </RoleProtectedRoute>
          } />
          <Route path="/admin/quiz-hunters" element={
            <RoleProtectedRoute allowedRoles={ROUTE_PERMISSIONS.ADMIN_QUIZ_HUNTERS}>
              <AdminQuizHunters />
            </RoleProtectedRoute>
          } />
          <Route path="/admin/code-crushers" element={
            <RoleProtectedRoute allowedRoles={ROUTE_PERMISSIONS.ADMIN_CODE_CRUSHERS}>
              <AdminCodeCrushers />
            </RoleProtectedRoute>
          } />
          <Route path="/admin/circuit-smashers" element={
            <RoleProtectedRoute allowedRoles={ROUTE_PERMISSIONS.ADMIN_CIRCUIT_SMASHERS}>
              <AdminCircuitSmashers />
            </RoleProtectedRoute>
          } />
          <Route path="/admin/route-seekers" element={
            <RoleProtectedRoute allowedRoles={ROUTE_PERMISSIONS.ADMIN_ROUTE_SEEKERS}>
              <AdminRouteSeekers />
            </RoleProtectedRoute>
          } />
          <Route path="/admin/battle-breakers" element={
            <RoleProtectedRoute allowedRoles={ROUTE_PERMISSIONS.ADMIN_BATTLE_BREAKERS}>
              <AdminBattleBreakers />
            </RoleProtectedRoute>
          } />
          <Route path="/admin/user-management" element={
            <RoleProtectedRoute allowedRoles={ROUTE_PERMISSIONS.ADMIN_USER_MANAGEMENT}>
              <UserManagement />
            </RoleProtectedRoute>
          } />
          <Route path="/admin/dashboard/battle-breakers" element={
            <RoleProtectedRoute allowedRoles={ROUTE_PERMISSIONS.ADMIN_BATTLE_BREAKERS_DASHBOARD}>
              <BuzzerDashboard />
            </RoleProtectedRoute>
          } />

          {/* Timer Dashboard - accessible without login for big screen presentation */}
          <Route path="/timer-dashboard" element={<TimerDashboard />} />
          <Route path="/admin/dashboard/timer" element={<TimerDashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;