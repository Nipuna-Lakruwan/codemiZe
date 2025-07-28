import React, { useState } from 'react';
import JudgeLayout from '../JudgeLayout';
import BattleBreakersTable from '../../../components/Judge/BattleBreakers/BattleBreakersTable';

const mockQuestions = [
  { _id: '1', question: 'What is a firewall in network security?', answer: 'A network security device that monitors and filters incoming and outgoing network traffic.' },
  { _id: '2', question: 'What is the purpose of DNS?', answer: 'Domain Name System translates human-readable domain names to IP addresses.' },
  { _id: '3', question: 'What is a subnet mask used for?', answer: 'It divides an IP address into network and host portions.' },
  { _id: '4', question: 'What is DHCP?', answer: 'Dynamic Host Configuration Protocol automatically assigns IP addresses to devices on a network.' },
  { _id: '5', question: 'What is the difference between TCP and UDP?', answer: 'TCP is connection-oriented and guarantees delivery, while UDP is connectionless and doesn\'t guarantee delivery.' },
];
const mockSchools = [
  { _id: '1', nameInShort: 'SMC', name: 'St. Mary\'s College', avatar: { url: '/c-logo.png' } },
  { _id: '2', nameInShort: 'RCG', name: 'Royal College Gampaha', avatar: { url: '/c-logo.png' } },
  { _id: '3', nameInShort: 'STC', name: 'St. Thomas\' College', avatar: { url: '/c-logo.png' } },
  { _id: '4', nameInShort: 'ANC', name: 'Ananda College', avatar: { url: '/c-logo.png' } },
  { _id: '5', nameInShort: 'DSC', name: 'D.S. Senanayake College', avatar: { url: '/c-logo.png' } },
];

const BattleBreakersJudge = () => {
  // State for questions and schools (mocked for demo)
  const [questions] = useState(mockQuestions);
  const [schools] = useState(mockSchools);

  // State for marking logic and UI
  const [answerHistory, setAnswerHistory] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [schoolAnswers, setSchoolAnswers] = useState({});
  const [correctSchool, setCorrectSchool] = useState(null);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState({});
  const [isQuestionActive, setIsQuestionActive] = useState(false);
  const [showQuestionText, setShowQuestionText] = useState(true);

  // Mark answer for a school (correct/wrong)
  const handleMarkAnswer = (schoolId, isCorrect) => {
    if (correctSchool !== null) return;
    if (totalAttempts >= 3 && !isCorrect) return;
    const currentQuestionId = questions[currentQuestionIndex]?._id;
    if (!currentQuestionId) return;

    if (isCorrect) {
      setSchoolAnswers(prev => ({ ...prev, [schoolId]: true }));
      setCorrectSchool(schoolId);
      setAnswerHistory(prev => ({
        ...prev,
        [currentQuestionId]: {
          ...prev[currentQuestionId],
          [schoolId]: true,
          correctSchool: schoolId
        }
      }));
    } else {
      setSchoolAnswers(prev => ({ ...prev, [schoolId]: false }));
      setTotalAttempts(prev => prev + 1);
      setWrongAttempts(prev => ({ ...prev, [schoolId]: (prev[schoolId] || 0) + 1 }));
      setAnswerHistory(prev => {
        const questionAnswers = prev[currentQuestionId] || {};
        const schoolAttempts = questionAnswers[`${schoolId}_attempts`] || 0;
        return {
          ...prev,
          [currentQuestionId]: {
            ...questionAnswers,
            [schoolId]: false,
            [`${schoolId}_attempts`]: schoolAttempts + 1
          }
        };
      });
    }
  };

  // Move to next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSchoolAnswers({});
      setCorrectSchool(null);
      setTotalAttempts(0);
      setWrongAttempts({});
    }
  };

  // Move to previous question
  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSchoolAnswers({});
      setCorrectSchool(null);
      setTotalAttempts(0);
      setWrongAttempts({});
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
            schoolAnswers={schoolAnswers}
            correctSchool={correctSchool}
            totalAttempts={totalAttempts}
            wrongAttempts={wrongAttempts}
            isQuestionActive={isQuestionActive}
            showQuestionText={showQuestionText}
            setShowQuestionText={setShowQuestionText}
            handleMarkAnswer={handleMarkAnswer}
            goToNextQuestion={goToNextQuestion}
            goToPrevQuestion={goToPrevQuestion}
            setIsQuestionActive={setIsQuestionActive}
          />
        </div>
      </div>
    </JudgeLayout>
  );
};

export default BattleBreakersJudge;