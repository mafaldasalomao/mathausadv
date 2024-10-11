import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import Swal from 'sweetalert2';
import './styles.css'
import { PdfContext } from '../../contexts/PdfContext';

const PDFViewer = () => {
  const { file } = useContext(PdfContext);
  const navigate = useNavigate();
  const [fileUrl, setFileUrl] = useState(null);
const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    if (!file) {
      Swal.fire('Atenção', 'Selecione um arquivo em PDF para resumir!');
      navigate('/');
    } else {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      
      // Clean up the URL object when the component unmounts or file changes
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file, navigate]);

  return (
    <div>
      {fileUrl && (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <div style={{ height: '100vh' }}>
            <Viewer
              fileUrl={fileUrl}
              plugins={[defaultLayoutPluginInstance]}
            />
          </div>
        </Worker>
      )}
    </div>
  );
};

export default PDFViewer;
