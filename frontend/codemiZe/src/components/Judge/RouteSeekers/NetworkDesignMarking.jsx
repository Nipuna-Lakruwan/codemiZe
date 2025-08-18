import React from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../../utils/axiosInstance';

const NetworkDesignMarking = ({
  schools,
  criteria,
  markings,
  handleMarkUpdate,
  handleKeyDown,
  calculateTotal,
  setSelectedCard,
  handleSubmitMarks,
  hasSubmitted
}) => {
  const handleDownload = async (schoolId, schoolName) => {
    try {
      const response = await axiosInstance.get(`/api/v1/route-seekers/network-designs/${schoolId}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      const contentDisposition = response.headers['content-disposition'];
      let filename = `${schoolName}-network-design.zip`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (error.response && error.response.data) {
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const errorData = JSON.parse(reader.result);
            alert(`Download failed: ${errorData.message}`);
          } catch (e) {
            alert('Download failed: An unknown error occurred.');
          }
        };
        reader.readAsText(error.response.data);
      } else {
        alert('Download failed: Could not connect to the server.');
      }
    }
  };

  return (
  <div className="flex flex-col h-full relative w-full">
    <div className="absolute left-8 top-8">
      <div className="justify-start text-purple-900 text-4xl font-normal font-['Jersey_25']" style={{ fontFamily: 'Jersey_25' }}>
        Network Design
      </div>
    </div>
    <div className="h-24" />
    <div className="flex flex-col items-center w-full h-[calc(100%-6rem)] justify-center">
      <div className="w-[1020px] h-[540px] bg-white rounded-[5px] border border-black/90 mx-auto flex flex-col">
        <div className="overflow-x-auto w-full flex-1">
          <div className="relative h-full flex flex-col">
            <table className="w-max bg-white" style={{ minWidth: '970px' }}>
              <thead>
                <tr className="bg-gray-100 border-b border-black/20">
                  <th className="py-3 px-4 text-left text-sm font-medium text-purple-800 w-40 sticky left-0 bg-gray-100 z-10">Criteria</th>
                  {schools.map((school) => (
                    <th key={school._id} className="py-2 px-3 text-center text-sm font-medium text-purple-800 border-l border-black/20 min-w-[120px]">
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
                          onClick={() => handleDownload(school._id, school.nameInShort)}
                          disabled={!school.networkDesign}
                          className={`mt-1 text-[10px] text-white px-2 py-1 rounded text-center ${
                            !school.networkDesign ? 'bg-gray-400 cursor-not-allowed' : 'bg-sky-600'
                          }`}
                        >
                          {!school.networkDesign ? 'No File' : 'Download'}
                        </motion.button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {criteria.map((criterion) => (
                  <tr key={criterion._id} className="border-b border-black/20">
                    <td className="py-3 px-4 text-sm font-medium sticky left-0 bg-white border-r border-black/20 z-10">
                      {criterion.criteria}
                    </td>
                    {schools.map((school) => (
                      <td key={`${school._id}-${criterion._id}`} className="py-2 px-3 text-center border-l border-black/20">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={markings[school._id]?.[criterion._id] || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === '') {
                              handleMarkUpdate(school._id, criterion._id, 0);
                            } else {
                              const numValue = Math.min(10, Math.max(0, parseInt(value) || 0));
                              handleMarkUpdate(school._id, criterion._id, numValue);
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
                    <td key={`${school._id}-total`} className="py-2 px-3 text-center font-bold text-purple-800 border-l border-black/20">
                      {calculateTotal(school._id)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end w-[1020px]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm font-medium"
          onClick={handleSubmitMarks}
        >
          {hasSubmitted ? 'Update All Marks' : 'Submit All Marks'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="ml-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium"
          onClick={() => setSelectedCard(null)}
        >
          Back to Selection
        </motion.button>
      </div>
    </div>
  </div>
);
};

export default NetworkDesignMarking;