import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import JudgeLayout from '../JudgeLayout';
import ScrollbarStyles from '../../../components/Admin/UserManagement/ScrollbarStyles';
import QuestionnaireSchoolList from '../../../components/Judge/RouteSeekers/QuestionnaireSchoolList';
import QuestionnaireResponses from '../../../components/Judge/RouteSeekers/QuestionnaireResponses';
import NetworkDesignMarking from '../../../components/Judge/RouteSeekers/NetworkDesignMarking';
import axiosInstance from '../../../utils/axiosInstance';

const RouteSeekersJudge = () => {
  const [loading, setLoading] = useState(true);
  const [gameStatus, setGameStatus] = useState('waiting');
  const [selectedCard, setSelectedCard] = useState(null);
  const [activeSchool, setActiveSchool] = useState(null);
  const [schools, setSchools] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [markings, setMarkings] = useState({});
  const [viewingQuestions, setViewingQuestions] = useState(false);
  const [schoolQuestions, setSchoolQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [activeSubmissionId, setActiveSubmissionId] = useState(null);

  const mockCriteria = [
    { id: 'c1', criteria: 'Network Topology' },
    { id: 'c2', criteria: 'IP Addressing Scheme' },
    { id: 'c3', criteria: 'Routing Configuration' },
    { id: 'c4', criteria: 'Security Implementation' },
    { id: 'c5', criteria: 'Network Scalability' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [schoolsRes, questionsRes, answersRes] = await Promise.all([
          axiosInstance.get('/api/v1/admin/schools'),
          axiosInstance.get('/api/v1/route-seekers/questions'),
          axiosInstance.get('/api/v1/route-seekers/all-student-answers')
        ]);

        const schoolsData = schoolsRes.data.schools;
        const answersData = answersRes.data;

        const schoolsWithSubmissions = schoolsData.map(school => {
          const submission = answersData.find(answer => (answer.userId?._id || answer.userId) === school._id);
          return { ...school, submission: submission || null };
        });

        setSchools(schoolsWithSubmissions);
        setQuestions(questionsRes.data);
        
        setGameStatus('marking');
        setCriteria(mockCriteria);

        const initialMarkings = {};
        schoolsRes.data.schools.forEach(school => {
          initialMarkings[school._id] = {};
          mockCriteria.forEach(criterion => {
            initialMarkings[school._id][criterion.id] = 0;
          });
        });
        setMarkings(initialMarkings);

      } catch (error) {
        console.error("Error fetching data", error);
        setGameStatus('waiting'); // Fallback to waiting on error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCardSelect = (card) => {
    setSelectedCard(card);
    if (card === 'questionnaire') {
      setViewingQuestions(false);
      setActiveSchool(null);
    }
  };

  const handleMarkUpdate = (schoolId, criteriaId, mark) => {
    setMarkings(prevMarkings => ({
      ...prevMarkings,
      [schoolId]: {
        ...prevMarkings[schoolId],
        [criteriaId]: mark
      }
    }));
  };

  const handleKeyDown = (e) => {
    if (
      ![8, 9, 13, 27, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57].includes(e.keyCode) &&
      !(e.ctrlKey === true && [65, 67, 86, 88].includes(e.keyCode)) &&
      !(e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      e.preventDefault();
    }
  };

  const handleViewSchoolQuestions = (school) => {
    const { submission } = school;

    if (!submission) {
      alert(`${school.name} has not submitted their answers yet.`);
      return;
    }

    const populatedQuestions = questions.map(q => {
      const studentAnswer = submission.Answers.find(a => a.questionId === q._id);
      return {
        id: q._id,
        questionId: q._id,
        question: q.question,
        answer: studentAnswer ? studentAnswer.answer : "Not Answered",
        status: studentAnswer ? (studentAnswer.isCorrect ? 'correct' : 'incorrect') : 'incorrect',
      };
    });

    setActiveSchool(school);
    setActiveSubmissionId(submission._id);
    setSchoolQuestions(populatedQuestions);
    setViewingQuestions(true);
  };

  const handleMarkQuestion = async (index, status) => {
    const updatedQuestions = [...schoolQuestions];
    updatedQuestions[index].status = status;
    setSchoolQuestions(updatedQuestions);

    const answersToUpdate = updatedQuestions.map(q => ({
      questionId: q.questionId,
      answer: q.answer,
      isCorrect: q.status === 'correct'
    }));

    try {
      await axiosInstance.put(`/api/v1/games/route-seekers/answers/${activeSubmissionId}`, { answers: answersToUpdate });
    } catch (error) {
      console.error("Failed to update marks", error);
      // Revert state on error
      const revertedQuestions = [...schoolQuestions];
      setSchoolQuestions(revertedQuestions);
      alert("Failed to update marks. Please try again.");
    }
  };

  const calculateTotal = (schoolId) => {
    if (!markings[schoolId]) return 0;
    return Object.values(markings[schoolId]).reduce((sum, mark) => sum + mark, 0);
  };

  const handleBackToSchools = () => {
    setViewingQuestions(false);
    setActiveSchool(null);
  };

  return (
    <JudgeLayout gameName="Route Seekers">
      <ScrollbarStyles />
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      ) : (
        <div className="text-gray-800 h-full">
          {gameStatus === 'waiting' ? (
            <div className="flex flex-col items-center justify-center h-full">
              <img src="/loading.gif" alt="Loading" className="h-20 w-auto mb-6" />
              <div className="justify-start text-sky-600 text-4xl font-bold font-['Oxanium']">
                Waiting For Submissions
              </div>
              <p className="text-gray-500 mt-4">Route Seekers game is waiting for submissions. The marking interface will appear once submissions are ready.</p>
            </div>
          ) : selectedCard === null ? (
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-semibold mb-8">Route Seekers Judging</h2>
              <div className="flex space-x-12">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white rounded-lg shadow-lg p-6 w-64 h-80 cursor-pointer flex flex-col items-center justify-center"
                  onClick={() => handleCardSelect('questionnaire')}
                >
                  <img
                    src="/quiz_hunters_logo-removebg 1.png"
                    alt="Questionnaire"
                    className="h-32 w-32 mb-4 object-contain"
                  />
                  <h3 className="text-xl font-bold text-center">Questionnaire</h3>
                  <p className="text-gray-500 text-sm text-center mt-2">
                    Review and mark student responses to network-related questions
                  </p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white rounded-lg shadow-lg p-6 w-64 h-80 cursor-pointer flex flex-col items-center justify-center"
                  onClick={() => handleCardSelect('network-design')}
                >
                  <img
                    src="/circuit samshers logo 1.png"
                    alt="Network Design"
                    className="h-32 w-32 mb-4 object-contain"
                  />
                  <h3 className="text-xl font-bold text-center">Network Design</h3>
                  <p className="text-gray-500 text-sm text-center mt-2">
                    Score network designs submitted by teams based on technical criteria
                  </p>
                </motion.div>
              </div>
            </div>
          ) : selectedCard === 'questionnaire' ? (
            <div className="w-full">
              {!viewingQuestions ? (
                <QuestionnaireSchoolList
                  schools={schools}
                  handleViewSchoolQuestions={handleViewSchoolQuestions}
                  setSelectedCard={setSelectedCard}
                />
              ) : (
                <QuestionnaireResponses
                  activeSchool={activeSchool}
                  schoolQuestions={schoolQuestions}
                  handleBackToSchools={handleBackToSchools}
                  handleMarkQuestion={handleMarkQuestion}
                />
              )}
            </div>
          ) : (
            <NetworkDesignMarking
              schools={schools}
              criteria={criteria}
              markings={markings}
              handleMarkUpdate={handleMarkUpdate}
              handleKeyDown={handleKeyDown}
              calculateTotal={calculateTotal}
              setSelectedCard={setSelectedCard}
            />
          )}
        </div>
      )}
    </JudgeLayout>
  );
};

export default RouteSeekersJudge;
