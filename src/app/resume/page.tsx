'use client';

import { useEffect, useRef, useState } from 'react';
import { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';

export default function CVPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let pdfDoc: PDFDocumentProxy | null = null;
    let renderTask: RenderTask | null = null;

    const renderPDF = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load PDF.js
        const pdfjsLib = await import('pdfjs-dist');
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
        
        // Use the worker from public directory
        const workerPath = `${basePath}/pdfjs/pdf.worker.min.mjs`;
        console.log('Worker path:', workerPath);
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath;

        // Load the PDF document
        const pdfPath = `${basePath}/Binayak Dotel Resume.pdf`;
        console.log('Loading PDF from:', pdfPath);

        const loadingTask = pdfjsLib.getDocument(pdfPath);
        pdfDoc = await loadingTask.promise;

        const page = await pdfDoc.getPage(1);

        let attempts = 0;
        while (!canvasRef.current && attempts < 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }

        const canvas = canvasRef.current;
        if (!canvas) throw new Error('Canvas not found');

        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas context not found');

        context.clearRect(0, 0, canvas.width, canvas.height);

        renderTask = page.render({ canvasContext: context, viewport });
        await renderTask.promise;

        setLoading(false);
      } catch (err) {
        console.error('Error rendering PDF:', err);
        setError(err instanceof Error ? err.message : 'Failed to load the CV.');
        setLoading(false);
      }
    };

    const timer = setTimeout(renderPDF, 500);

    return () => {
      clearTimeout(timer);
      if (renderTask) renderTask.cancel();
      if (pdfDoc) pdfDoc.destroy();
    };
  }, []);

  const handleDownload = () => {
    try {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      const link = document.createElement('a');
      link.href = `${basePath}/Binayak Dotel Resume.pdf`;
      link.download = 'Binayak Dotel Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Failed to download the CV.');
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
            <canvas ref={canvasRef} className={`max-w-full h-auto ${loading ? 'hidden' : 'block'}`} />
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
