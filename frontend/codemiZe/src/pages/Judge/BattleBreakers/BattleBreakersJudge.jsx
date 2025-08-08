import React, { useState, useEffect } from 'react';
import JudgeLayout from '../JudgeLayout';
import BattleBreakersTable from '../../../components/Judge/BattleBreakers/BattleBreakersTable';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPaths';

const BattleBreakersJudge = () => {
  // State for questions and schools (fetched from API)
  const [questions, setQuestions] = useState([]);
  const [schools, setSchools] = useState([]);

  // State for display only
  const [answerHistory, setAnswerHistory] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuestionText, setShowQuestionText] = useState(true);

  // Fetch Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.BATTLE_BREAKERS.GET_QUESTIONS);
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  // Fetch Schools
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.ADMIN.GET_ALL_SCHOOLS);
        setSchools(response.data.schools);
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    };
    fetchSchools();
  }, []);

  const loadExistingAttempts = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.BATTLE_BREAKERS.GET_ANSWERS);
      const existingAnswers = response.data;
      
      // Transform the backend data into the frontend answerHistory format
      const transformedAnswerHistory = {};
      
      existingAnswers.forEach(answerDoc => {
        // Skip if questionId is null or undefined
        if (!answerDoc.questionId || !answerDoc.questionId._id) {
          console.warn('Skipping answer document with null/undefined questionId:', answerDoc);
          return;
        }
        
        const questionId = answerDoc.questionId._id;
        transformedAnswerHistory[questionId] = {};
        
        let correctSchoolId = null;
        let totalAttempts = 0;
        
        // Process each response
        answerDoc.responses.forEach(response => {
          // Skip if userId is null or undefined
          if (!response.userId || !response.userId._id) {
            console.warn('Skipping response with null/undefined userId:', response);
            return;
          }
          
          const schoolId = response.userId._id;
          const attempt = response.attempt;
          const isCorrect = response.status === "Correct";
          
          // Track the specific attempt
          transformedAnswerHistory[questionId][`${schoolId}_attempt_${attempt}`] = isCorrect;
          
          // Set general school status (for backward compatibility)
          transformedAnswerHistory[questionId][schoolId] = isCorrect;
          
          // Track correct school
          if (isCorrect) {
            correctSchoolId = schoolId;
          }
          
          // Track total attempts
          totalAttempts = Math.max(totalAttempts, attempt);
        });
        
        // Set metadata
        if (correctSchoolId) {
          transformedAnswerHistory[questionId].correctSchool = correctSchoolId;
        }
        transformedAnswerHistory[questionId].totalAttempts = totalAttempts;
      });
      
      setAnswerHistory(transformedAnswerHistory);
    } catch (error) {
      console.error("Error fetching existing attempts:", error);
    }
  };

  // Fetch existing answers/attempts
  useEffect(() => {
    // Only fetch if we have questions and schools loaded
    if (questions.length > 0 && schools.length > 0) {
      loadExistingAttempts();
    }
  }, [questions, schools, currentQuestionIndex]);

  // Move to next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Move to previous question
  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  return (
    <JudgeLayout gameName="Battle Breakers">
      <div className="w-full h-full flex flex-col relative">
        {/* Heading styled like Circuit Smashers */}
        <div className="absolute left-8 top-8">
          <div className="justify-start text-purple-900 text-4xl font-normal font-['Jersey_25']" style={{ fontFamily: 'Jersey_25' }}>
            Battle Breakers
          </div>
        </div>
        <div className="h-24" />
        <div className="flex flex-col items-center w-full h-[calc(100%-6rem)] justify-center">
          <BattleBreakersTable
            questions={questions}
            schools={schools}
            answerHistory={answerHistory}
            currentQuestionIndex={currentQuestionIndex}
            showQuestionText={showQuestionText}
            setShowQuestionText={setShowQuestionText}
            goToNextQuestion={goToNextQuestion}
            goToPrevQuestion={goToPrevQuestion}
            isJudgeView={true}
          />
        </div>
      </div>
    </JudgeLayout>
  );
};

export default BattleBreakersJudge;