import React, { useState, useEffect } from 'react';
import JudgeLayout from '../JudgeLayout';
import ScrollbarStyles from '../../../components/Admin/UserManagement/ScrollbarStyles';
import MarkingTable from '../../../components/Judge/CircuitSmashers/MarkingTable';
import LoadingScreen from '../../../components/Judge/CircuitSmashers/LoadingScreen';

// CircuitSmashersJudge: Main judge page for Circuit Smashers game
const CircuitSmashersJudge = () => {
  // Game status: waiting, marking, completed
  const [gameStatus, setGameStatus] = useState('waiting');
  // Loading spinner state
  const [loading, setLoading] = useState(true);
  // School/team list
  const [schools, setSchools] = useState([]);
  // Marking criteria
  const [criteria, setCriteria] = useState([]);
  // Markings for each school/criteria
  const [markings, setMarkings] = useState({});
  // Not used in UI, but kept for future: activeSchool
  const [activeSchool, setActiveSchool] = useState(null);

  // Mock data for criteria and schools
  const mockCriteria = [
    { id: 'c1', criteria: 'Circuit Design' },
    { id: 'c2', criteria: 'Power Efficiency' },
    { id: 'c3', criteria: 'Component Selection' },
    { id: 'c4', criteria: 'Functionality' },
    { id: 'c5', criteria: 'Innovation' }
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
          setActiveSchool(mockSchools[0].id);
        }
        setLoading(false);
      }, 1500);
    };
    fetchData();
  }, []);

  // Update marks for a school/criteria
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

  // Calculate total marks for a school
  const calculateTotal = (schoolId) => {
    if (!markings[schoolId]) return 0;
    return Object.values(markings[schoolId]).reduce((sum, mark) => sum + mark, 0);
  };

  return (
    <JudgeLayout gameName="Circuit Smashers">
      <ScrollbarStyles />
      <div className="w-full h-full flex flex-col relative">
        {loading ? (
          // Show loading screen
          <LoadingScreen />
        ) : (
          <div className="flex flex-col h-full relative w-full">
            {/* Heading styled like Quiz Hunters */}
            <div className="absolute left-8 top-8">
              <div className="justify-start text-purple-900 text-4xl font-normal font-['Jersey_25']" style={{ fontFamily: 'Jersey_25' }}>
                Circuit Smashers
              </div>
            </div>
            {/* Spacer to push table below heading */}
            <div className="h-24" />
            <div className="flex flex-col items-center w-full h-[calc(100%-6rem)] justify-center">
              {gameStatus === 'waiting' ? (
                // Waiting for submissions
                <div className="flex flex-col items-center justify-center h-full">
                  <img src="/loading.gif" alt="Loading" className="h-20 w-auto mb-6" />
                  <div className="justify-start text-sky-600 text-4xl font-bold font-['Oxanium']">
                    Waiting For Submissions
                  </div>
                  <p className="text-gray-500 mt-4">Circuit Smashers game is waiting for submissions. The marking interface will appear once submissions are ready.</p>
                </div>
              ) : (
                // Marking table for judges
                <MarkingTable
                  schools={schools}
                  criteria={criteria}
                  markings={markings}
                  handleMarkUpdate={handleMarkUpdate}
                  handleKeyDown={handleKeyDown}
                  calculateTotal={calculateTotal}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </JudgeLayout>
  );
};

export default CircuitSmashersJudge;