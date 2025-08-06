import React, { useState, useEffect } from 'react';
import JudgeLayout from '../JudgeLayout';
import ScrollbarStyles from '../../../components/Admin/UserManagement/ScrollbarStyles';
import MarkingTable from '../../../components/Judge/CodeCrushers/MarkingTable';
import LoadingScreen from '../../../components/Judge/CodeCrushers/LoadingScreen';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPaths';

// CodeCrushersJudge: Main judge page for Code Crushers game
const CodeCrushersJudge = () => {
  // Game status: waiting, marking, completed
  const [gameStatus, setGameStatus] = useState('waiting');
  const [loading, setLoading] = useState(true);

  const [schools, setSchools] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [markings, setMarkings] = useState({});

  // Simulate fetching data (API call)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

        const status = 'marking';
        setGameStatus(status);
        if (status === 'marking') {
          const schools = await axiosInstance.get(API_PATHS.ADMIN.GET_ALL_SCHOOLS);
          const criteria = await axiosInstance.get(API_PATHS.CODE_CRUSHERS.GET_CRITERIA);
          setSchools(schools.data.schools);
          setCriteria(criteria.data.criteria);

          // Initialize empty markings for all schools/criteria
          const initialMarkings = {};
          schools.data.schools.forEach(school => {
            initialMarkings[school._id] = {};
            criteria.data.criteria.forEach(criterion => {
              initialMarkings[school._id][criterion._id] = 0;
            });
          });
          // Fetch existing markings and merge with initialized structure
        try {
          const existingMarkings = await axiosInstance.get(API_PATHS.JUDGE.GET_CODE_CRUSHERS_MARKINGS);
          
          // Merge existing markings with the initialized structure
          if (existingMarkings.data && typeof existingMarkings.data === 'object') {
            for (const schoolId in existingMarkings.data) {
              if (initialMarkings[schoolId]) {
                for (const criteriaId in existingMarkings.data[schoolId]) {
                  if (initialMarkings[schoolId][criteriaId] !== undefined) {
                    initialMarkings[schoolId][criteriaId] = existingMarkings.data[schoolId][criteriaId];
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('Error fetching existing markings:', error);
          // Continue with empty markings if fetch fails
        }
        setMarkings(initialMarkings);
      }
      setLoading(false);
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

  const handleSubmit = async () => {
    try {
      await axiosInstance.post(API_PATHS.JUDGE.SUBMIT_CODE_CRUSHERS_MARKS, { 
        markings
      });
      alert('Marks submitted successfully!');
    } catch (error) {
      console.error('Error submitting marks:', error);
      alert('Failed to submit marks. Please try again.');
    }
  };

  const handleDownload = async (schoolId) => {
    try {
      const response = await axiosInstance.get(API_PATHS.CODE_CRUSHERS.GET_RESOURCE(schoolId), {
        responseType: 'blob' // Important for file downloads
      });
      
      // Get the filename from the response headers
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'resource_file';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      // Create a blob URL and trigger download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error downloading resource:', error);
      if (error.response?.status === 404) {
        alert('Resource file not found for this school.');
      } else {
        alert('Failed to download resource. Please try again.');
      }
    }
  };


  return (
    <JudgeLayout gameName="Code Crushers">
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
                Code Crushers
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
                  <p className="text-gray-500 mt-4">Code Crushers game is waiting for submissions. The marking interface will appear once submissions are ready.</p>
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
                  onSubmission={handleSubmit}
                  onDownload={handleDownload}
                  maxMark={20}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </JudgeLayout>
  );
};

export default CodeCrushersJudge;