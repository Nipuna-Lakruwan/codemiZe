import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import JudgeLayout from '../JudgeLayout';
import ScrollbarStyles from '../../../components/Admin/UserManagement/ScrollbarStyles';

const CodeCrushersJudge = () => {
  const [gameStatus, setGameStatus] = useState('waiting'); // 'waiting', 'marking', 'completed'
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [markings, setMarkings] = useState({});
  const [activeSchool, setActiveSchool] = useState(null);

  // Mock criteria for Code Crushers
  const mockCriteria = [
    { id: 'c1', criteria: 'Code Quality' },
    { id: 'c2', criteria: 'Algorithm Efficiency' },
    { id: 'c3', criteria: 'Functionality' },
    { id: 'c4', criteria: 'User Interface' },
    { id: 'c5', criteria: 'Documentation' }
  ];

  // Mock schools data (expanded to 10 schools)
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

  // Simulate fetching data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        setTimeout(() => {
          // For demo purposes, always show marking mode
          const status = 'marking';
          setGameStatus(status);

          if (status === 'marking') {
            // Ensure all 10 schools are set
            setSchools(mockSchools);
            setCriteria(mockCriteria);

            // Initialize empty markings for all schools
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
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle mark updates
  const handleMarkUpdate = (schoolId, criteriaId, mark) => {
    setMarkings(prevMarkings => ({
      ...prevMarkings,
      [schoolId]: {
        ...prevMarkings[schoolId],
        [criteriaId]: mark
      }
    }));
  };

  // Handle keydown to validate input
  const handleKeyDown = (e) => {
    // Allow: backspace, delete, tab, escape, enter, and numbers
    if (
      ![8, 9, 13, 27, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57].includes(e.keyCode) &&
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      !(e.ctrlKey === true && [65, 67, 86, 88].includes(e.keyCode)) &&
      // Allow: home, end, left, right
      !(e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      e.preventDefault();
    }
  };

  // Calculate total score for a school
  const calculateTotal = (schoolId) => {
    if (!markings[schoolId]) return 0;
    return Object.values(markings[schoolId]).reduce((sum, mark) => sum + mark, 0);
  };

  return (
    <JudgeLayout gameName="Code Crushers">
      <ScrollbarStyles />
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      ) : (
        <div className="text-gray-800 h-full">
          {gameStatus === 'waiting' ? (
            // Game is in waiting state - show waiting message
            <div className="flex flex-col items-center justify-center h-full">
              <img src="/loading.gif" alt="Loading" className="h-20 w-auto mb-6" />
              <div className="justify-start text-sky-600 text-4xl font-bold font-['Oxanium']">
                Waiting For Submissions
              </div>
              <p className="text-gray-500 mt-4">Code Crushers game is waiting for submissions. The marking interface will appear once submissions are ready.</p>
            </div>
          ) : (
            // Game is in marking state - show marking interface
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold">Code Crushers Marking</h2>
                <p className="text-gray-500 text-sm">Score each school's code submission based on the criteria below. Enter a number from 0-10 in each cell.</p>
              </div>

              {/* Marking Table with Fixed First Column */}
              <div className="w-full max-w-[1500px] h-[600px] bg-white rounded-[5px] border border-black/90 mx-auto">
                {/* Table container with horizontal scroll */}
                <div className="overflow-x-auto w-full h-full" style={{ scrollbarWidth: 'thin', scrollbarColor: '#9333ea #f3f4f6' }}>
                  <table className="w-max bg-white" style={{ minWidth: '1400px' }}>
                    <thead>
                      <tr className="bg-gray-100 border-b border-black/20">
                        <th className="py-3 px-4 text-left text-sm font-medium text-purple-800 w-40 sticky left-0 bg-gray-100 z-10">Criteria</th>
                        {schools.map((school) => (
                          <th key={school.id} className="py-2 px-3 text-center text-sm font-medium text-purple-800 border-l border-black/20 min-w-[120px]">
                            <div className="flex flex-col items-center">
                              <div className="w-10 h-10 rounded-full overflow-hidden mb-1">
                                <img
                                  src={school.avatar?.url || '/c-logo.png'}
                                  alt={school.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="text-xs font-medium">{school.nameInShort}</span>
                              <span className="text-[10px] text-gray-500 mb-1 truncate max-w-[110px]" title={school.name}>{school.name}</span>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="mt-1 text-[10px] bg-sky-600 text-white px-2 py-1 rounded text-center"
                              >
                                Download
                              </motion.button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {criteria.map((criterion) => (
                        <tr key={criterion.id} className="border-b border-black/20">
                          <td className="py-3 px-4 text-sm font-medium sticky left-0 bg-white border-r border-black/20 z-10">
                            {criterion.criteria}
                          </td>
                          {schools.map((school) => (
                            <td key={`${school.id}-${criterion.id}`} className="py-2 px-3 text-center border-l border-black/20">
                              <input
                                type="number"
                                min="0"
                                max="10"
                                value={markings[school.id]?.[criterion.id] || ''}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  // Allow empty input for clearing
                                  if (value === '') {
                                    handleMarkUpdate(school.id, criterion.id, 0);
                                  } else {
                                    // Parse to number and limit between 0 and 10
                                    const numValue = Math.min(10, Math.max(0, parseInt(value) || 0));
                                    handleMarkUpdate(school.id, criterion.id, numValue);
                                  }
                                }}
                                onKeyDown={handleKeyDown}
                                className="w-14 h-9 border border-gray-300 rounded text-center font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"
                                aria-label={`Score for ${school.name} on ${criterion.criteria}`}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr className="bg-purple-50">
                        <td className="py-3 px-4 text-sm font-bold text-purple-800 sticky left-0 bg-purple-50 border-r border-black/20 z-10">
                          Total Score
                        </td>
                        {schools.map((school) => (
                          <td key={`${school.id}-total`} className="py-2 px-3 text-center font-bold text-purple-800 border-l border-black/20">
                            {calculateTotal(school.id)}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-medium"
                >
                  Submit All Marks
                </motion.button>
              </div>
            </div>
          )}
        </div>
      )}
    </JudgeLayout>
  );
};

export default CodeCrushersJudge;
