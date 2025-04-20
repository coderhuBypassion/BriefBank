import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Download, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PDFViewerProps {
  fileUrl: string;
  title: string;
}

export default function PDFViewer({ fileUrl, title }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(20); // Placeholder, would be determined by PDF.js in real implementation
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Simulate loading the PDF
  useEffect(() => {
    // In a real implementation, we would use PDF.js to load the PDF and get the total pages
    // For demo purposes, we'll use a random number of pages
    setTotalPages(Math.floor(Math.random() * 15) + 10); // Random between 10-25 pages
  }, [fileUrl]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDownload = () => {
    // In a real implementation, we would initiate a download of the PDF
    window.open(fileUrl, '_blank');
  };

  const toggleFullscreen = () => {
    // In a real implementation, we would toggle fullscreen mode
    setIsFullscreen(!isFullscreen);
  };

  // Generate thumbnail slides
  const thumbnails = [];
  for (let i = 1; i <= totalPages; i++) {
    thumbnails.push(
      <div 
        key={i}
        className={`flex-shrink-0 w-20 h-16 bg-gray-200 rounded cursor-pointer hover:ring-2 hover:ring-primary ${
          i === currentPage ? 'ring-2 ring-primary' : ''
        }`}
        onClick={() => setCurrentPage(i)}
      ></div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="bg-gray-800 px-4 py-3 flex justify-between items-center">
        <div className="text-white font-medium">Pitch Deck</div>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="text-gray-300 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-white">{currentPage} / {totalPages}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="text-gray-300 hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDownload}
            className="text-gray-300 hover:text-white ml-2"
          >
            <Download className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleFullscreen}
            className="text-gray-300 hover:text-white"
          >
            <Maximize className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="p-4 flex justify-center items-center bg-gray-100 h-[600px]">
        {/* This would be replaced with PDF.js rendering in a real implementation */}
        <div className="flex flex-col items-center justify-center bg-white shadow-lg w-4/5 h-4/5">
          <div className="text-xl font-bold mb-4">{title}</div>
          <div className="text-lg mb-2">Page {currentPage} of {totalPages}</div>
          <div className="text-gray-500 text-center">
            In a production app, this would display the actual PDF content using PDF.js
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-white border-t">
        <div className="flex overflow-x-auto scrollbar-hide space-x-4 pb-2">
          {thumbnails}
        </div>
      </div>
    </div>
  );
}
