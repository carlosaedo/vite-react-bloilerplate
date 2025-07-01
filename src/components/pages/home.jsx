import React, { useState } from 'react';
import { Printer, FileText, Mail } from 'lucide-react';

const Home = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('ar');
  const [templateData, setTemplateData] = useState({
    ar: {
      companyName: 'Torres, Lda.',
      address1: 'RUA PARQUE COMERCIAL, N.º 91 -- Nogueira',
      postalCode: '4715 216 BRAGA',
    },
    ctt: {
      recipientName: 'WILLIAN DE MATOS MARTINS',
      recipientAddress1: 'R Rafael Bordalo Pinheiro 32 12',
      recipientPostal: '2 9 5 0 5 8 0 Quinta do Anjo',
      senderName: 'TORRES, LDA',
      senderAddress: 'PARQUE COMERCIAL, N.º 91, NOGUEIRA',
      senderPostal: '4 7 1 5 2 1 6 BRAGA',
    },
    tci: {
      address1: 'R. do Parque Comercial, 91 - Nogueira',
      address2: 'Apartado 2468',
      postalCode: '4701-906 Braga',
    },
  });

  const templates = {
    ar: { name: 'A5 Template (AR)', icon: FileText, format: 'A5' },
    ctt: { name: 'CTT Envelope', icon: Mail, format: 'Envelope' },
    tci: { name: 'TCI Sky Envelope', icon: Mail, format: 'Envelope' },
  };

  const handleInputChange = (template, field, value) => {
    setTemplateData((prev) => ({
      ...prev,
      [template]: {
        ...prev[template],
        [field]: value,
      },
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const renderTemplate = () => {
    const data = templateData[selectedTemplate];

    switch (selectedTemplate) {
      case 'ar':
        return (
          <div
            className='relative bg-white border-2 border-gray-300 print-template mx-auto'
            style={{
              width: '148mm',
              height: '210mm',
              transform: 'scale(0.6)',
              transformOrigin: 'top left',
            }}
          >
            {/* A5 Template */}
            <div className='absolute' style={{ top: '50mm', left: '20mm' }}>
              <div className='font-bold text-lg mb-2'>{data.companyName}</div>
              <div className='text-sm mb-1'>{data.address1}</div>
              <div className='text-sm'>{data.postalCode}</div>
            </div>
          </div>
        );

      case 'ctt':
        return (
          <div
            className='relative bg-white border-2 border-gray-300 print-template mx-auto'
            style={{
              width: '220mm',
              height: '110mm',
              transform: 'scale(0.5)',
              transformOrigin: 'top left',
            }}
          >
            {/* CTT Envelope Template */}
            {/* Recipient Address - Center Right */}
            <div className='absolute font-mono' style={{ top: '35mm', left: '120mm' }}>
              <div className='text-sm font-bold mb-1'>{data.recipientName}</div>
              <div className='text-sm mb-1'>{data.recipientAddress1}</div>
              <div className='text-sm tracking-wider'>{data.recipientPostal}</div>
            </div>

            {/* Sender Address - Top Left */}
            <div className='absolute font-mono' style={{ top: '15mm', left: '15mm' }}>
              <div className='text-xs font-bold'>{data.senderName}</div>
              <div className='text-xs'>{data.senderAddress}</div>
              <div className='text-xs tracking-wider'>{data.senderPostal}</div>
            </div>
          </div>
        );

      case 'tci':
        return (
          <div
            className='relative bg-white border-2 border-gray-300 print-template mx-auto'
            style={{
              width: '220mm',
              height: '110mm',
              transform: 'scale(0.5)',
              transformOrigin: 'top left',
            }}
          >
            {/* TCI Sky Envelope Template */}
            <div className='absolute' style={{ top: '40mm', left: '130mm' }}>
              <div className='text-sm mb-1'>{data.address1}</div>
              <div className='text-sm mb-1'>{data.address2}</div>
              <div className='text-sm font-bold'>{data.postalCode}</div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderEditForm = () => {
    const data = templateData[selectedTemplate];

    switch (selectedTemplate) {
      case 'ar':
        return (
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>Company Name</label>
              <input
                type='text'
                value={data.companyName}
                onChange={(e) => handleInputChange('ar', 'companyName', e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-md'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Address</label>
              <input
                type='text'
                value={data.address1}
                onChange={(e) => handleInputChange('ar', 'address1', e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-md'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Postal Code</label>
              <input
                type='text'
                value={data.postalCode}
                onChange={(e) => handleInputChange('ar', 'postalCode', e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-md'
              />
            </div>
          </div>
        );

      case 'ctt':
        return (
          <div className='space-y-4'>
            <div className='border-b pb-4'>
              <h4 className='font-medium mb-2'>Recipient</h4>
              <div className='space-y-2'>
                <input
                  type='text'
                  placeholder='Recipient Name'
                  value={data.recipientName}
                  onChange={(e) => handleInputChange('ctt', 'recipientName', e.target.value)}
                  className='w-full p-2 border border-gray-300 rounded-md text-sm'
                />
                <input
                  type='text'
                  placeholder='Address'
                  value={data.recipientAddress1}
                  onChange={(e) => handleInputChange('ctt', 'recipientAddress1', e.target.value)}
                  className='w-full p-2 border border-gray-300 rounded-md text-sm'
                />
                <input
                  type='text'
                  placeholder='Postal Code'
                  value={data.recipientPostal}
                  onChange={(e) => handleInputChange('ctt', 'recipientPostal', e.target.value)}
                  className='w-full p-2 border border-gray-300 rounded-md text-sm'
                />
              </div>
            </div>
            <div>
              <h4 className='font-medium mb-2'>Sender</h4>
              <div className='space-y-2'>
                <input
                  type='text'
                  placeholder='Sender Name'
                  value={data.senderName}
                  onChange={(e) => handleInputChange('ctt', 'senderName', e.target.value)}
                  className='w-full p-2 border border-gray-300 rounded-md text-sm'
                />
                <input
                  type='text'
                  placeholder='Address'
                  value={data.senderAddress}
                  onChange={(e) => handleInputChange('ctt', 'senderAddress', e.target.value)}
                  className='w-full p-2 border border-gray-300 rounded-md text-sm'
                />
                <input
                  type='text'
                  placeholder='Postal Code'
                  value={data.senderPostal}
                  onChange={(e) => handleInputChange('ctt', 'senderPostal', e.target.value)}
                  className='w-full p-2 border border-gray-300 rounded-md text-sm'
                />
              </div>
            </div>
          </div>
        );

      case 'tci':
        return (
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>Address Line 1</label>
              <input
                type='text'
                value={data.address1}
                onChange={(e) => handleInputChange('tci', 'address1', e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-md'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Address Line 2</label>
              <input
                type='text'
                value={data.address2}
                onChange={(e) => handleInputChange('tci', 'address2', e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-md'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Postal Code</label>
              <input
                type='text'
                value={data.postalCode}
                onChange={(e) => handleInputChange('tci', 'postalCode', e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-md'
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>RH Torrestir - Print service</h1>
        <p className='text-gray-600'>Select a template and customize the text for printing</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Template Selection */}
        <div className='lg:col-span-1 space-y-4'>
          <div className='bg-white rounded-lg shadow-md p-4'>
            <h2 className='text-lg font-semibold mb-4'>Select Template</h2>
            <div className='space-y-2'>
              {Object.entries(templates).map(([key, template]) => {
                const IconComponent = template.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedTemplate(key)}
                    className={`w-full p-3 rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${
                      selectedTemplate === key
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <IconComponent size={18} />
                    <div className='text-left'>
                      <div className='font-medium'>{template.name}</div>
                      <div className='text-xs text-gray-500'>{template.format}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Edit Form */}
          <div className='bg-white rounded-lg shadow-md p-4'>
            <h2 className='text-lg font-semibold mb-4'>Edit Text</h2>
            {renderEditForm()}
            <button
              onClick={handlePrint}
              className='w-full mt-6 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2'
            >
              <Printer size={18} />
              Print Template
            </button>
          </div>
        </div>

        {/* Template Preview */}
        <div className='lg:col-span-2'>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-lg font-semibold mb-4'>Preview</h2>
            <div className='flex justify-center overflow-auto'>{renderTemplate()}</div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media print {
            body * {
              visibility: hidden;
            }

            .print-template, .print-template * {
              visibility: visible;
            }

            .print-template {
              position: absolute;
              left: 0;
              top: 0;
              transform: none !important;
            }

            @page {
              margin: 0;
              size: ${selectedTemplate === 'ar' ? 'A5' : 'A4 landscape'};
            }
          }
        `,
        }}
      />
    </div>
  );
};

export default Home;
