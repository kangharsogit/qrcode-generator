
import React, { useState, useMemo, useCallback } from 'react';
import { QrCodeType, VCardData } from './types';
import TabButton from './components/TabButton';
import QrCodeDisplay from './components/QrCodeDisplay';
import { LinkIcon, TextIcon, VCardIcon } from './components/icons';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<QrCodeType>(QrCodeType.URL);
  
  const [url, setUrl] = useState<string>('https://gemini.google.com');
  const [text, setText] = useState<string>('Hello, World!');
  const [vCard, setVCard] = useState<VCardData>({
    name: 'John Doe',
    phone: '+1234567890',
    email: 'john.doe@example.com',
    organization: 'Example Corp',
    website: 'https://example.com'
  });

  const [size, setSize] = useState<number>(256);
  const [fgColor, setFgColor] = useState<string>('#000000');
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');

  const handleVCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVCard({ ...vCard, [e.target.name]: e.target.value });
  };
  
  const generateVCardString = useCallback((data: VCardData): string => {
      let vCardString = 'BEGIN:VCARD\n';
      vCardString += 'VERSION:3.0\n';
      if (data.name) vCardString += `FN:${data.name}\n`;
      if (data.organization) vCardString += `ORG:${data.organization}\n`;
      if (data.phone) vCardString += `TEL;TYPE=WORK,VOICE:${data.phone}\n`;
      if (data.email) vCardString += `EMAIL:${data.email}\n`;
      if (data.website) vCardString += `URL:${data.website}\n`;
      vCardString += 'END:VCARD';
      return vCardString;
  }, []);

  const qrValue = useMemo<string>(() => {
    switch (activeTab) {
      case QrCodeType.URL:
        if (!url) return '';
        // Prepend https:// if no protocol is present to ensure it's a valid URL QR code
        return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
      case QrCodeType.TEXT:
        return text;
      case QrCodeType.VCARD:
        return generateVCardString(vCard);
      default:
        return '';
    }
  }, [activeTab, url, text, vCard, generateVCardString]);

  const renderActiveForm = () => {
    switch (activeTab) {
      case QrCodeType.URL:
        return (
          <div className="space-y-4">
            <label htmlFor="url" className="block text-sm font-medium text-gray-300">Website URL</label>
            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g., https://example.com"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
        );
      case QrCodeType.TEXT:
        return (
          <div className="space-y-4">
            <label htmlFor="text" className="block text-sm font-medium text-gray-300">Your Text</label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter any text"
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
        );
      case QrCodeType.VCARD:
        return (
          <div className="space-y-4">
            {(Object.keys(vCard) as Array<keyof VCardData>).map((key) => (
              <div key={key}>
                <label htmlFor={key} className="block text-sm font-medium text-gray-300 capitalize">{key}</label>
                <input
                  id={key}
                  type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
                  name={key}
                  value={vCard[key]}
                  onChange={handleVCardChange}
                  placeholder={`Enter ${key}`}
                  className="mt-1 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
              QR Code Generator
            </span>
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-400">
            Create and customize your QR codes instantly.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Panel: Controls */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl flex flex-col gap-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-200 mb-4">Select QR Code Type</h2>
              <div className="grid grid-cols-3 gap-3">
                <TabButton label="URL" icon={<LinkIcon className="w-5 h-5"/>} isActive={activeTab === QrCodeType.URL} onClick={() => setActiveTab(QrCodeType.URL)} />
                <TabButton label="Text" icon={<TextIcon className="w-5 h-5"/>} isActive={activeTab === QrCodeType.TEXT} onClick={() => setActiveTab(QrCodeType.TEXT)} />
                <TabButton label="vCard" icon={<VCardIcon className="w-5 h-5"/>} isActive={activeTab === QrCodeType.VCARD} onClick={() => setActiveTab(QrCodeType.VCARD)} />
              </div>
            </div>
            
            <div className="flex-grow">
              {renderActiveForm()}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-200 mb-4">Customize</h2>
              <div className="space-y-4">
                {/* Size Slider */}
                <div>
                    <label htmlFor="size" className="block text-sm font-medium text-gray-300">Size: {size}px</label>
                    <input
                        id="size"
                        type="range"
                        min="128"
                        max="512"
                        step="8"
                        value={size}
                        onChange={(e) => setSize(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                {/* Color Pickers */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="fgColor" className="block text-sm font-medium text-gray-300">Foreground</label>
                        <input id="fgColor" type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full h-10 p-1 bg-gray-700 border border-gray-600 rounded-md cursor-pointer"/>
                    </div>
                    <div>
                        <label htmlFor="bgColor" className="block text-sm font-medium text-gray-300">Background</label>
                        <input id="bgColor" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 p-1 bg-gray-700 border border-gray-600 rounded-md cursor-pointer"/>
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: QR Code Display */}
          <div className="flex items-center justify-center">
            <QrCodeDisplay value={qrValue} size={size} fgColor={fgColor} bgColor={bgColor} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
