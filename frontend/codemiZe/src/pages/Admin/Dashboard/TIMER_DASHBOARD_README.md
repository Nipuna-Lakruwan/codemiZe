# Timer Dashboard Feature Documentation

## Overview

The Timer Dashboard provides a visual representation of game timers for the CodemiZe platform. It displays a game logo on the left side and a circular timer on the right side.

## Features

- Large circular countdown timer with color changes (green → yellow → red)
- Game logo and description display
- Works for multiple games:
  - Battle Breakers
  - Circuit Smashers
  - Code Crushers
  - Route Seekers

## How to Use

### Demo Mode (No Backend Required)

The Timer Dashboard includes a demo mode that works without backend integration:

1. Visit `/timer-dashboard` in your browser
2. Press the "Enter Demo Mode" button
3. Select a game to start its timer
4. Use keyboard shortcuts for control:
   - `1-4`: Select different games
   - `Space`: Pause/Resume timer
   - `R`: Reset timer
   - `Esc`: Exit game

### Integration with Backend

When connected to the backend, the Timer Dashboard automatically responds to game events:

- Game start events
- Timer updates
- Game end events

## Access Routes

- Public view: `/timer-dashboard` (accessible without login for presentation displays)
- Admin view: `/admin/dashboard/timer` (same dashboard but through admin routes)

## Development

The Timer Dashboard is built with:

- React
- Framer Motion for animations
- Context API for socket integration

To modify the circular timer animation, edit the `CircularTimer.jsx` component.
