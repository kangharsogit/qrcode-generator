
import React, { useState, useEffect, useRef } from 'react';
import { DownloadIcon } from './icons';

// Add type declaration for the QRCode library loaded from CDN
declare var QRCode: {
  toDataURL: (
    text: string,
    options: any,
    callback: (err: Error | null, url: string) => void
  ) => void;
};

interface QrCodeDisplayProps {
  value: string;
  size: number;
  fgColor: string;
  bgColor: string;
}

const QrCodeDisplay: React.FC<QrCodeDisplayProps> = ({ value, size, fgColor, bgColor }) => {
  const [dataUrl, setDataUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (value) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        QRCode.toDataURL(value, {
          width: size,
          margin: 2,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: 'H'
        }, (err, url) => {
          if (err) {
            console.error(err);
            setDataUrl('');
          } else {
            setDataUrl(url);
          }
          setIsLoading(false);
        });
      }, 300); // Debounce QR code generation for better performance
      return () => clearTimeout(timer);
    } else {
      setDataUrl('');
    }
  }, [value, size, fgColor, bgColor]);

  const handleDownload = () => {
    if (dataUrl && downloadLinkRef.current) {
        downloadLinkRef.current.href = dataUrl;
        downloadLinkRef.current.click();
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl w-full h-full flex flex-col items-center justify-center gap-6 transition-all duration-300">
      <div className="relative flex items-center justify-center bg-white rounded-lg p-4" style={{ width: size + 32, height: size + 32 }}>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-lg z-10">
            <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        {dataUrl ? (
          <img 
            src={dataUrl} 
            alt="Generated QR Code" 
            className="transition-opacity duration-300"
            style={{ width: size, height: size, opacity: isLoading ? 0.5 : 1 }}
          />
        ) : (
          <div className="text-gray-500 text-center flex flex-col items-center justify-center" style={{ width: size, height: size }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Enter data to generate a QR code</span>
          </div>
        )}
      </div>
      <button
        onClick={handleDownload}
        disabled={!dataUrl || isLoading}
        className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500"
      >
        <DownloadIcon className="w-5 h-5" />
        Download PNG
      </button>
      <a ref={downloadLinkRef} download="qrcode.png" className="hidden"></a>
    </div>
  );
};

export default QrCodeDisplay;
