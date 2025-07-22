import React from 'react';
import { motion } from 'framer-motion';
import BuzzerComponent from './BuzzerComponent';
import TimerComponent from './TimerComponent';
import QuestionDisplay from './QuestionDisplay';

export default function ActiveGameScreen({
  currentQuestionIndex,
  totalQuestions,
  currentQuestion,
  timeLeft,
  totalTime,
  buzzerDisabled,
  handleBuzzerClick,
  isPaused,
  isCorrect,
  showAnswer,
  hasAnswered
}) {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-8 relative">
      {/* Game header */}
      <motion.div
        className="w-full max-w-6xl flex flex-col sm:flex-row justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Game logo */}
        <div className="flex items-center mb-4 sm:mb-0">
          <img
            src="/Battle breakers logo 1.png"
            alt="Battle Breakers"
            className="w-16 h-16 object-contain mr-3"
          />
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Battle Breakers</h1>
        </div>

        {/* Timer */}
        <div className="w-full sm:w-auto sm:min-w-[300px]">
          <TimerComponent
            totalTime={totalTime}
            timeLeft={timeLeft}
            isPaused={isPaused}
          />
        </div>
      </motion.div>

      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-center lg:items-start">
        {/* Question section */}
        <motion.div
          className="w-full lg:w-2/3 order-2 lg:order-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <QuestionDisplay
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            question={currentQuestion}
            isCorrect={isCorrect}
            showAnswer={showAnswer}
            answer={currentQuestion?.answer}
          />
        </motion.div>

        {/* Buzzer section */}
        <motion.div
          className="w-full lg:w-1/3 flex flex-col items-center justify-center order-1 lg:order-2 pb-8 lg:pb-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="mb-6 text-center">
            <p className="text-xl text-white font-medium mb-2">
              {buzzerDisabled
                ? hasAnswered
                  ? "You've answered this question"
                  : "Wait for the next question"
                : "Press when you know the answer!"}
            </p>
            {isPaused && (
              <p className="text-yellow-300 text-lg animate-pulse">Game is paused</p>
            )}
          </div>

          <BuzzerComponent
            isDisabled={buzzerDisabled || isPaused}
            onBuzzerClick={handleBuzzerClick}
            hasAnswered={hasAnswered}
            animateWhenDisabled={isPaused}
          />

          {hasAnswered && (
            <motion.p
              className="mt-4 text-green-400 font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Your answer has been submitted!
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Status messages */}
      {isPaused && (
        <motion.div
          className="fixed inset-x-0 top-0 bg-yellow-600 text-white text-center py-2 font-medium"
          initial={{ y: -40 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          Game is currently paused by the administrator
        </motion.div>
      )}
    </div>
  );
}
