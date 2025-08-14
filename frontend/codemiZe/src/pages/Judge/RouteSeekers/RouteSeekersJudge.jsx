import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import JudgeLayout from '../JudgeLayout';
import ScrollbarStyles from '../../../components/Admin/UserManagement/ScrollbarStyles';
import QuestionnaireSchoolList from '../../../components/Judge/RouteSeekers/QuestionnaireSchoolList';
import QuestionnaireResponses from '../../../components/Judge/RouteSeekers/QuestionnaireResponses';
import NetworkDesignMarking from '../../../components/Judge/RouteSeekers/NetworkDesignMarking';

const RouteSeekersJudge = () => {
  // State for loading spinner
  const [loading, setLoading] = useState(true);
  // Game status: waiting, marking, completed
  const [gameStatus, setGameStatus] = useState('waiting');
  // Which card is selected (questionnaire/network-design)
  const [selectedCard, setSelectedCard] = useState(null);
  // Currently active school for questionnaire
  const [activeSchool, setActiveSchool] = useState(null);
  // School/team list
  const [schools, setSchools] = useState([]);
  // Marking criteria for network design
  const [criteria, setCriteria] = useState([]);
  // Markings for network design
  const [markings, setMarkings] = useState({});
  // Questionnaire view state
  const [viewingQuestions, setViewingQuestions] = useState(false);
  // Questions for the selected school
  const [schoolQuestions, setSchoolQuestions] = useState([]);

  // Mock data for criteria and schools
  const mockCriteria = [
    { id: 'c1', criteria: 'Network Topology' },
    { id: 'c2', criteria: 'IP Addressing Scheme' },
    { id: 'c3', criteria: 'Routing Configuration' },
    { id: 'c4', criteria: 'Security Implementation' },
    { id: 'c5', criteria: 'Network Scalability' }
  ];

  const mockSchools = [
    { id: 's1', name: 'Royal College', nameInShort: 'RC', avatar: { url: '/c-logo.png' } },
    { id: 's2', name: 'Ananda College', nameInShort: 'AC', avatar: { url: '/c-logo.png' } },
    { id: 's3', name: 'St. Joseph\'s College', nameInShort: 'SJC', avatar: { url: '/c-logo.png' } },
    { id: 's4', name: 'D.S. Senanayake College', nameInShort: 'DSC', avatar: { url: '/c-logo.png' } },
    { id: 's5', name: 'Visakha Vidyalaya', nameInShort: 'VV', avatar: { url: '/c-logo.png' } },
    { id: 's6', name: 'Nalanda College', nameInShort: 'NC', avatar: { url: '/c-logo.png' } },
    { id: 's7', name: 'Mahanama College', nameInShort: 'MC', avatar: { url: '/c-logo.png' } },
    { id: 's8', name: 'Isipathana College', nameInShort: 'IC', avatar: { url: '/c-logo.png' } },
    { id: 's9', name: 'St. Thomas\' College', nameInShort: 'STC', avatar: { url: '/c-logo.png' } },
    { id: 's10', name: 'Dharmaraja College', nameInShort: 'DRC', avatar: { url: '/c-logo.png' } }
  ];

  // Mock questions for questionnaire
  const mockQuestionsList = [
    { id: 1, question: "What is the primary protocol used for web communication?", answer: "HTTP protocol", status: 'incorrect' },
    { id: 2, question: "What does DNS stand for?", answer: "Domain Name System", status: 'correct' },
    { id: 3, question: "What is the default port for HTTP?", answer: "Port 80", status: 'correct' },
    { id: 4, question: "What does IP stand for in IP Address?", answer: "Internet Protocol", status: 'correct' },
    { id: 5, question: "What is a subnet mask used for?", answer: "It helps to identify which part of an IP address refers to the network", status: 'incorrect' },
    { id: 6, question: "What is the purpose of a router in a network?", answer: "To connect different networks and forward data packets between them", status: 'correct' },
    { id: 7, question: "What is the OSI model?", answer: "A 7-layer model that describes how networks function", status: 'incorrect' }
  ];

  // Simulate fetching data (API call)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setTimeout(() => {
        const status = 'marking';
        setGameStatus(status);
        if (status === 'marking') {
          setSchools(mockSchools);
          setCriteria(mockCriteria);
          // Initialize empty markings for all schools/criteria
          const initialMarkings = {};
          mockSchools.forEach(school => {
            initialMarkings[school.id] = {};
            mockCriteria.forEach(criterion => {
              initialMarkings[school.id][criterion.id] = 0;
            });
          });
          setMarkings(initialMarkings);
        }
        setLoading(false);
      }, 1500);
    };
    fetchData();
  }, []);

  // Card selection handler (questionnaire/network-design)
  const handleCardSelect = (card) => {
    setSelectedCard(card);
    if (card === 'questionnaire') {
      setViewingQuestions(false);
      setActiveSchool(null);
    }
  };

  // Update marks for network design
  const handleMarkUpdate = (schoolId, criteriaId, mark) => {
    setMarkings(prevMarkings => ({
      ...prevMarkings,
      [schoolId]: {
        ...prevMarkings[schoolId],
        [criteriaId]: mark
      }
    }));
  };

  // Only allow number input for marks
  const handleKeyDown = (e) => {
    if (
      ![8, 9, 13, 27, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57].includes(e.keyCode) &&
      !(e.ctrlKey === true && [65, 67, 86, 88].includes(e.keyCode)) &&
      !(e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      e.preventDefault();
    }
  };

  // Open questionnaire for a school
  const handleViewSchoolQuestions = (school) => {
    setActiveSchool(school);
    setViewingQuestions(true);
    setSchoolQuestions(mockQuestionsList);
  };

  // Mark a questionnaire answer as correct/incorrect
  const handleMarkQuestion = (index, status) => {
    const updatedQuestions = [...schoolQuestions];
    updatedQuestions[index].status = status;
    setSchoolQuestions(updatedQuestions);
  };

  // Calculate total marks for a school (network design)
  const calculateTotal = (schoolId) => {
    if (!markings[schoolId]) return 0;
    return Object.values(markings[schoolId]).reduce((sum, mark) => sum + mark, 0);
  };

  // Go back to school list from questionnaire
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
            // Waiting for submissions
            <div className="flex flex-col items-center justify-center h-full">
              <img src="/loading.gif" alt="Loading" className="h-20 w-auto mb-6" />
              <div className="justify-start text-sky-600 text-4xl font-bold font-['Oxanium']">
                Waiting For Submissions
              </div>
              <p className="text-gray-500 mt-4">Route Seekers game is waiting for submissions. The marking interface will appear once submissions are ready.</p>
            </div>
          ) : selectedCard === null ? (
            // Card selection (Questionnaire/Network Design)
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-semibold mb-8">Route Seekers Judging</h2>
              <div className="flex space-x-12">
                {/* Questionnaire Card */}
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
                {/* Network Design Card */}
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
            // Questionnaire flow
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
            // Network Design marking table
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