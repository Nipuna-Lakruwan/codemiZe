import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
import { motion } from 'framer-motion';

const PdfViewer = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, numPages));
  };

  return (
    <motion.div
      className="w-[1029px] h-[566px] bg-stone-200/5 rounded-lg shadow-[0px_0px_34px_-6px_rgba(104,104,104,0.22)] border border-white/5 backdrop-blur-[5.90px] flex flex-col items-center p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="w-[973px] h-[466px] bg-zinc-300 rounded-md flex flex-col relative mb-4 overflow-hidden">
        {/* Top right controls */}
        <div className="absolute top-2 right-2 flex space-x-2 z-10">
          <button
            className="bg-violet-800/80 hover:bg-violet-700 text-white px-3 py-1 rounded flex items-center text-sm"
            onClick={() => window.open(pdfUrl, '_blank')}
          >
            Open in New Tab
          </button>

          <button
            className="bg-violet-800/80 hover:bg-violet-700 text-white px-3 py-1 rounded flex items-center text-sm"
            onClick={() => document.documentElement.requestFullscreen()}
          >
            Fullscreen
          </button>
        </div>

        {/* PDF rendering */}
        <div className="flex-grow flex justify-center items-center">
          <Document
            file={pdfUrl}
            onLoadSuccess={handleLoadSuccess}
            loading={<p>Loading PDF...</p>}
            className="text-center"
          >
            <Page
              pageNumber={currentPage}
              width={850}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-6">
        <button
          className={`px-4 py-2 rounded-md ${
            currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-violet-700 hover:bg-violet-600'
          } text-white transition-colors`}
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Back
        </button>

        <div className="text-white/80">
          Page {currentPage} of {numPages || '...'}
        </div>

        <button
          className={`px-4 py-2 rounded-md ${
            currentPage === numPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-violet-700 hover:bg-violet-600'
          } text-white transition-colors`}
          onClick={handleNextPage}
          disabled={currentPage === numPages}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default PdfViewer;