import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { motion } from 'framer-motion';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure worker - using the bundled worker from react-pdf with fallback
try {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString();
} catch (error) {
  // Fallback to CDN if bundled worker fails
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

const PdfViewer = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const handleLoadError = (error) => {
    console.error('PDF load error:', error);
    setError('Failed to load PDF. Please try refreshing the page.');
    setLoading(false);
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
          {error ? (
            <div className="text-center text-red-600">
              <p className="text-lg font-semibold mb-2">Error Loading PDF</p>
              <p className="text-sm">{error}</p>
              <button 
                className="mt-4 px-4 py-2 bg-violet-700 text-white rounded hover:bg-violet-600"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : (
            <Document
              file={pdfUrl}
              onLoadSuccess={handleLoadSuccess}
              onLoadError={handleLoadError}
              loading={
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading PDF...</p>
                </div>
              }
              error={
                <div className="text-center text-red-600">
                  <p>Failed to load PDF</p>
                </div>
              }
              className="text-center"
            >
              <Page
                pageNumber={currentPage}
                width={850}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            </Document>
          )}
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