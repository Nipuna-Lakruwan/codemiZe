# Battle Breakers Component Architecture

This document outlines the component structure for the Battle Breakers game in the codemiZe platform.

## Component Structure

The Battle Breakers game has been refactored into the following components:

1. **BattleBreakers.jsx** (Main Container)
   - Manages game state
   - Handles socket communication
   - Conditionally renders the appropriate screen based on game state

2. **StartScreen.jsx**
   - Initial game start screen with the Battle Breakers logo
   - Provides the start button to join the game
   - Displays loading state when joining

3. **ActiveGameScreen.jsx**
   - Main game interface during gameplay
   - Displays the current question, buzzer, and timer
   - Organizes the layout for the game elements

4. **GameCompletedScreen.jsx**
   - End screen shown when the game is completed
   - Displays the final score and congratulatory message
   - Shows team name and provides a return to dashboard button

5. **BuzzerComponent.jsx**
   - Reusable buzzer button component
   - Handles different states: enabled, disabled, pressed, and answered
   - Provides visual feedback with animations

6. **TimerComponent.jsx**
   - Displays the countdown timer
   - Shows a progress bar that changes color based on time remaining
   - Handles paused state with visual indicators

7. **QuestionDisplay.jsx**
   - Displays the current question
   - Shows question number and total questions count
   - Displays answer when revealed
   - Indicates if the answer was correct or incorrect

## Integration

To use these components, import them into the BattleBreakers.jsx file:

```jsx
import StartScreen from '../../../components/Student/BattleBreakers/StartScreen';
import ActiveGameScreen from '../../../components/Student/BattleBreakers/ActiveGameScreen';
import GameCompletedScreen from '../../../components/Student/BattleBreakers/GameCompletedScreen';
```

The main BattleBreakers component will handle:

- Socket connections
- Game state management
- Conditional rendering of the appropriate screen

## Usage Notes

1. The components are designed to be responsive and work well on different screen sizes
2. Framer Motion is used for animations to enhance user experience
3. The component structure allows for easier maintenance and feature additions
4. DOMPurify is used in QuestionDisplay to sanitize any HTML content

## Example Integration

```jsx
export default function BattleBreakers() {
  // State management and socket handlers...

  if (gameCompleted) {
    return (
      <GameCompletedScreen 
        score={score} 
        totalQuestions={questions.length}
        teamName={teamInfo.name}
      />
    );
  }

  if (gameStarted) {
    return (
      <ActiveGameScreen
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        currentQuestion={questions[currentQuestionIndex]}
        timeLeft={timeLeft}
        totalTime={totalTime}
        buzzerDisabled={buzzerDisabled}
        handleBuzzerClick={handleBuzzerClick}
        isPaused={isPaused}
        isCorrect={isCorrect}
        showAnswer={showAnswer}
        hasAnswered={hasAnswered}
      />
    );
  }

  return (
    <StartScreen
      handleStartGame={handleStartGame}
      isLoading={isLoading}
    />
  );
}
```

This architecture maintains the current functionality while making the code more maintainable and easier to extend.
