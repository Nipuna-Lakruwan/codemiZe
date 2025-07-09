import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login/Login';
import GamesRoadmap from './pages/Student/GamesRoadmap';

// Import all game pages
import QuizHunters from './pages/Student/QuizHunters/QuizHunters';
import CodeCrushers from './pages/Student/CodeCrushers/CodeCrushers';
import CircuitSmashers from './pages/Student/CircuitSmashers/CircuitSmashers';
import RouteSeekers from './pages/Student/RouteSeekers/RouteSeekers';
import BattleBreakers from './pages/Student/BattleBreakers/BattleBreakers';

// Create router with all routes
const router = createBrowserRouter(
  [
    { path: "/", element: <Login /> },
    { path: "/student/games-roadmap", element: <GamesRoadmap /> },
    { path: "/student/quiz-hunters", element: <QuizHunters /> },
    { path: "/student/code-crushers", element: <CodeCrushers /> },
    { path: "/student/circuit-smashers", element: <CircuitSmashers /> },
    { path: "/student/route-seekers", element: <RouteSeekers /> },
    { path: "/student/battle-breakers", element: <BattleBreakers /> },
  ],
  {
    future: {
      v7_startTransition: true,
      unstable_wrapRouteLoader: true // Add this to fully silence the warning in latest React Router
    }
  }
);

function App() {
  return (
    <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed relative overflow-hidden"
      style={{ backgroundImage: "url('/background.jpg')" }}>
      {/* Dark overlay layer */}
      <div className="min-h-screen w-full bg-black/70 relative z-10">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;