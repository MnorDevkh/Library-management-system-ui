import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import * as pdfjsLib from "pdfjs-dist";
import baseURL from "../redux/service/url";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const PdfViewer = () => {
  const queryParams = new URLSearchParams(location.search);
  const filename = queryParams.get("filename");
  const title = queryParams.get("title") || "Untitled PDF";
  const description = queryParams.get("description") || "No description available";
  const [pdf, setPdf] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const canvasRef = useRef(null);

  const sanitizedFilename = filename.replace(/\.pdf$/, "");
  const pdfUrl = `${baseURL.defaults.baseURL}/uploads/pdf/${sanitizedFilename}`;

  useEffect(() => {
    const loadPdfFromUrl = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdfDoc = await loadingTask.promise;
        setPdf(pdfDoc);
        setTotalPages(pdfDoc.numPages);
        setPageNumber(1);
      } catch (error) {
        console.error("Failed to load PDF:", error);
      }
    };

    loadPdfFromUrl();
  }, [pdfUrl]);

  useEffect(() => {
    const renderPDF = async () => {
      if (!pdf || !canvasRef.current) return;

      const page = await pdf.getPage(pageNumber);
      const scale = 1.5;

      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: context,
        viewport,
      };

      await page.render(renderContext).promise;

      context.restore();
    };

    renderPDF();
  }, [pdf, pageNumber]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setPageNumber(page);
    }
  };

  return (
    <div className="flex md:min-h-screen min-h-0 bg-gray-100">
      {/* Sidebar for page navigation */}
      <div className="md:block w-1/6 hidden bg-white h-auto md:h-[1200px]  shadow-md p-4 md:p-0  overflow-y-auto">
        {/* <h2 className="text-xl font-bold mb-4">Contents</h2> */}
        <ul className="space-y-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index + 1}>
              <button
                onClick={() => goToPage(index + 1)}
                className={`w-full text-left px-4 py-2 rounded ${
                  pageNumber === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Page {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main PDF Viewer */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <canvas className="w-5/6" ref={canvasRef}></canvas>
        <div className="mt-4 flex gap-4 items-center">
          <button
            onClick={() => goToPage(pageNumber - 1)}
            disabled={pageNumber === 1}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {pageNumber} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(pageNumber + 1)}
            disabled={pageNumber === totalPages}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

PdfViewer.propTypes = {
  filename: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default PdfViewer;