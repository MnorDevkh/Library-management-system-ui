

import { useLocation } from 'react-router-dom';
import PdfViewer from '../PdfViewer';

const ReadPDFBookComponent = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filename = queryParams.get("filename"); 
  return (
    <div className='mx-auto max-w-7xl'>
      {filename ? (
        <PdfViewer filename={filename} />
      ) : (
        <p>No file selected</p>
      )}
    </div>
  );
};

export default ReadPDFBookComponent;