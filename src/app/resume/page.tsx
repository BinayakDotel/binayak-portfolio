'use client';

import { useEffect, useRef, useState } from 'react';
import { getCVInfo } from '@/utils/data';

export default function CVPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cvInfo = getCVInfo();

  useEffect(() => {
    let pdfDoc: any = null;
    let renderTask: any = null;

    const renderPDF = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load PDF.js
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';

        // Ensure the file path is correct
        const pdfPath = cvInfo.file.startsWith('/') ? cvInfo.file : `/${cvInfo.file}`;
        console.log('Loading PDF from:', pdfPath);

        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument(pdfPath);
        pdfDoc = await loadingTask.promise;
        console.log('PDF loaded successfully');

        // Get the first page
        const page = await pdfDoc.getPage(1);
        
        // Wait for canvas to be available
        let attempts = 0;
        while (!canvasRef.current && attempts < 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        const canvas = canvasRef.current;
        if (!canvas) {
          throw new Error('Canvas element not found after multiple attempts');
        }

        // Set up the canvas
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render the page
        const context = canvas.getContext('2d');
        if (!context) {
          throw new Error('Could not get canvas context');
        }

        // Clear any previous content
        context.clearRect(0, 0, canvas.width, canvas.height);

        renderTask = page.render({
          canvasContext: context,
          viewport: viewport,
        });

        await renderTask.promise;
        console.log('PDF rendered successfully');
        setLoading(false);
      } catch (err) {
        console.error('Error rendering PDF:', err);
        setError(err instanceof Error ? err.message : 'Failed to load the CV. Please try again later.');
        setLoading(false);
      }
    };

    // Start rendering after a short delay
    const timer = setTimeout(renderPDF, 500);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (renderTask) {
        renderTask.cancel();
      }
      if (pdfDoc) {
        pdfDoc.destroy();
      }
    };
  }, []);

  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = cvInfo.file;
      link.download = 'Binayak Dotel Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Failed to download the CV. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Curriculum Vitae</h1>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Download CV
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-gray-100 rounded-lg shadow-lg p-4">
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              className={`max-w-full h-auto ${loading ? 'hidden' : 'block'}`}
            />
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
