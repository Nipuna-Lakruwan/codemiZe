import React from 'react';
import { Route } from 'react-router-dom';
import TimerDashboard from '../pages/Admin/Dashboard/TimerDashboard';

const timerRoutes = [
  <Route key="timer-dashboard" path="/timer-dashboard" element={<TimerDashboard />} />
];

export default timerRoutes;
