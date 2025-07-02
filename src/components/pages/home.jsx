import React, { useState } from 'react';
import { Printer, FileText, Mail } from 'lucide-react';

const Home = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('ctt_a5');
  const [templateData, setTemplateData] = useState({
    ctt_a5: {
      name: 'Torres, Lda.',
      address: 'RUA PARQUE COMERCIAL, N.º 91 -- Nogueira',
      postalCode: '4701',
      postalCode2: '906',
      city: 'Braga',
      senderName: 'Torres, Lda.',
      senderAddress: 'RUA PARQUE COMERCIAL, N.º 91 -- Nogueira',
      senderPostalCode: '4701',
      senderPostalCode2: '906',
      senderCity: 'Braga',
    },
    envelope_com10: {
      recipientName: 'CAPITÃO FAUSTO',
      recipientsenderAddress: 'R Rafael Bordalo Pinheiro 32 12',
      recipientPostal: '2950-580 Quinta do Anjo',
      senderName: 'TORRES, LDA',
      senderAddress: 'PARQUE COMERCIAL, N.º 91, NOGUEIRA',
      senderPostal: '4715-216 BRAGA',
    },
    ctt_aviso_rec: {
      senderName: 'TORRES, LDA',
      senderAddress: 'PARQUE COMERCIAL, N.º 91, NOGUEIRA',
      senderCountry: 'Portugal',
      senderPostalCode: '4701',
      senderPostalCode2: '906',
      senderCity: 'Braga',
      name: 'Capitão Fausto',
      address: 'Rua 25 de Abril, 1',
      address2: 'Nogueiró',
      country: 'Portugal',
      postalCodeAndCity: '4715-216 Braga',
    },
  });

  const templates = {
    ctt_a5: { name: 'CTT A5', icon: FileText, format: 'A5' },
    envelope_com10: { name: 'Envelope COM 10', icon: Mail, format: 'Envelope' },
    ctt_aviso_rec: { name: 'CTT Aviso Entrega', icon: Mail, format: 'Envelope' },
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

  const getPageSize = () => {
    switch (selectedTemplate) {
      case 'ctt_a5':
        return 'A5';
      case 'envelope_com10':
        return '220mm 110mm'; // Custom envelope size
      case 'ctt_aviso_rec':
        return '242mm 110mm'; // Custom envelope size
      default:
        return 'A4';
    }
  };

  const getPrintSizesW = () => {
    switch (selectedTemplate) {
      case 'ctt_a5':
        return '148mm';
      case 'envelope_com10':
        return '220mm'; // Custom envelope size
      case 'ctt_aviso_rec':
        return '242mm'; // Custom envelope size
      default:
        return '148mm';
    }
  };

  const getPrintSizesH = () => {
    switch (selectedTemplate) {
      case 'ctt_a5':
        return '220mm';
      case 'envelope_com10':
        return '110mm'; // Custom envelope size
      case 'ctt_aviso_rec':
        return '110mm'; // Custom envelope size
      default:
        return '220mm';
    }
  };

  const renderTemplate = () => {
    const data = templateData[selectedTemplate];

    switch (selectedTemplate) {
      case 'ctt_a5':
        return (
          <div
            className='relative bg-white border-2 border-gray-300 print-template mx-auto'
            style={{
              width: '148mm',
              height: '210mm',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          >
            <div className='absolute' style={{ top: '46mm', left: '13mm' }}>
              <div className='font-bold text-lg mb-2 whitespace-pre'>{data.name}</div>
              <div className='text-sm mb-1 whitespace-pre'>{data.address}</div>
            </div>

            <div className='absolute' style={{ top: '64mm', left: '32mm' }}>
              <div className='flex gap-[10px] text-sm font-bold whitespace-pre'>
                <div className='flex gap-[3px]'>
                  {data.postalCode?.split('').map((char, index) => (
                    <span key={index}>{char}</span>
                  ))}
                </div>

                <div className='flex gap-[3px]'>
                  {data.postalCode2?.split('').map((char, index) => (
                    <span key={index}>{char}</span>
                  ))}
                </div>

                <div>{data.city}</div>
              </div>
            </div>

            {/* A5 Template */}
            <div className='absolute' style={{ top: '76mm', left: '13mm' }}>
              <div className='font-bold text-lg mb-2 whitespace-pre'>{data.senderName}</div>
              <div className='text-sm mb-1 whitespace-pre'>{data.senderAddress}</div>
            </div>
            <div className='absolute' style={{ top: '94mm', left: '32mm' }}>
              <div className='flex gap-[10px] text-sm font-bold whitespace-pre'>
                <div className='flex gap-[3px]'>
                  {data.senderPostalCode?.split('').map((char, index) => (
                    <span key={index}>{char}</span>
                  ))}
                </div>

                <div className='flex gap-[3px]'>
                  {data.senderPostalCode2?.split('').map((char, index) => (
                    <span key={index}>{char}</span>
                  ))}
                </div>
                <div>{data.senderCity}</div>
              </div>
            </div>
          </div>
        );

      case 'envelope_com10':
        return (
          <div
            className='relative bg-white border-2 border-gray-300 print-template mx-auto'
            style={{
              width: '220mm',
              height: '110mm',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          >
            {/* CTT Envelope Template */}
            {/* Recipient Address - Center Right */}
            <div className='absolute font-mono' style={{ top: '35mm', left: '120mm' }}>
              <div className='text-sm font-bold mb-1 whitespace-pre'>{data.recipientName}</div>
              <div className='text-sm mb-1 whitespace-pre'>{data.recipientsenderAddress}</div>
              <div className='text-sm tracking-wider whitespace-pre'>{data.recipientPostal}</div>
            </div>

            {/* Sender Address - Top Left */}
            <div className='absolute font-mono' style={{ top: '15mm', left: '15mm' }}>
              <div className='text-xs font-bold whitespace-pre'>{data.senderName}</div>
              <div className='text-xs whitespace-pre'>{data.senderAddress}</div>
              <div className='text-xs tracking-wider whitespace-pre'>{data.senderPostal}</div>
            </div>
          </div>
        );

      case 'ctt_aviso_rec':
        return (
          <div
            className='relative bg-white border-2 border-gray-300 print-template mx-auto'
            style={{
              width: '242mm',
              height: '110mm',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          >
            <div className='absolute font-mono' style={{ top: '13mm', left: '22mm' }}>
              <div className='text-xs font-bold whitespace-pre'>{data.name}</div>
              <div className='text-xs whitespace-pre'>{data.address}</div>
              <div className='text-xs tracking-wider whitespace-pre'>{data.address2}</div>
              <div className='flex gap-[10px] text-xs tracking-wider whitespace-pre'>
                <div>{data.postalCodeAndCity}</div>
                <div>{data.country}</div>
              </div>
            </div>

            <div className='absolute' style={{ top: '55mm', left: '130mm' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3mm' }}>
                <div className='font-bold text-sm whitespace-pre'>{data.senderName}</div>
                <div className='text-sm whitespace-pre'>{data.senderAddress}</div>
                <div className='text-sm whitespace-pre'>{data.senderCountry}</div>
              </div>
            </div>

            <div className='absolute' style={{ top: '82mm', left: '130mm' }}>
              <div className='flex gap-[10px] text-sm font-bold whitespace-pre'>
                <div>{data.senderPostalCode}</div>
                <div>{data.senderPostalCode2}</div>
                <div>{data.senderCity}</div>
              </div>
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
      case 'ctt_a5':
        return (
          <div className='space-y-4'>
            <div className='border-b border-dashed border-gray-400 pb-4'>
              <h4 className='font-medium mb-2'>Destinatário</h4>
              <div>
                <label className='block text-sm font-medium mb-1'>Empresa</label>
                <input
                  type='text'
                  value={data.name}
                  onChange={(e) => handleInputChange('ctt_a5', 'name', e.target.value)}
                  className='w-full p-2 border border-gray-300 rounded-md text-sm'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>Endereço</label>
                <input
                  type='text'
                  value={data.address}
                  onChange={(e) => handleInputChange('ctt_a5', 'address', e.target.value)}
                  className='w-full p-2 border border-gray-300 rounded-md text-sm'
                />
              </div>
              <div>
                <label className='block text-sm font-medium mb-1'>Código Postal e Cidade</label>
                <div className='flex gap-[10px]'>
                  <input
                    type='text'
                    value={data.senderPostalCode}
                    onChange={(e) => handleInputChange('ctt_a5', 'postalCode', e.target.value)}
                    className='min-w-0 w-[120px] p-2 border border-gray-300 rounded-md'
                  />
                  <input
                    type='text'
                    value={data.senderPostalCode2}
                    onChange={(e) => handleInputChange('ctt_a5', 'postalCode2', e.target.value)}
                    className='min-w-0 w-[80px] p-2 border border-gray-300 rounded-md'
                  />
                  <input
                    type='text'
                    value={data.senderCity}
                    onChange={(e) => handleInputChange('ctt_a5', 'city', e.target.value)}
                    className='min-w-0 w-[140px] p-2 border border-gray-300 rounded-md'
                  />
                </div>
              </div>
            </div>

            <h4 className='font-medium mb-2'>Remetente</h4>
            <div>
              <label className='block text-sm font-medium mb-1'>Empresa</label>
              <input
                type='text'
                value={data.senderName}
                onChange={(e) => handleInputChange('ctt_a5', 'senderName', e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-md text-sm'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Endereço</label>
              <input
                type='text'
                value={data.senderAddress}
                onChange={(e) => handleInputChange('ctt_a5', 'senderAddress', e.target.value)}
                className='w-full p-2 border border-gray-300 rounded-md text-sm'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Código Postal e Cidade</label>
              <div className='flex gap-[10px]'>
                <input
                  type='text'
                  value={data.senderPostalCode}
                  onChange={(e) => handleInputChange('ctt_a5', 'senderPostalCode', e.target.value)}
                  className='min-w-0 w-[120px] p-2 border border-gray-300 rounded-md'
                />
                <input
                  type='text'
                  value={data.senderPostalCode2}
                  onChange={(e) => handleInputChange('ctt_a5', 'senderPostalCode2', e.target.value)}
                  className='min-w-0 w-[80px] p-2 border border-gray-300 rounded-md'
                />
                <input
                  type='text'
                  value={data.senderCity}
                  onChange={(e) => handleInputChange('ctt_a5', 'senderCity', e.target.value)}
                  className='min-w-0 w-[140px] p-2 border border-gray-300 rounded-md'
                />
              </div>
            </div>
          </div>
        );

      case 'envelope_com10':
        return (
          <div className='space-y-4'>
            <div className='border-b border-dashed border-gray-400 pb-4'>
              <h4 className='font-medium mb-2'>Destinatário</h4>
              <div className='space-y-2'>
                <div>
                  <label className='block text-sm font-medium mb-1'>Nome</label>
                  <input
                    type='text'
                    value={data.recipientName}
                    onChange={(e) =>
                      handleInputChange('envelope_com10', 'recipientName', e.target.value)
                    }
                    className='w-full p-2 border border-gray-300 rounded-md text-sm text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>Endereço</label>
                  <input
                    type='text'
                    value={data.recipientsenderAddress}
                    onChange={(e) =>
                      handleInputChange('envelope_com10', 'recipientsenderAddress', e.target.value)
                    }
                    className='w-full p-2 border border-gray-300 rounded-md text-sm text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>Código Postal</label>
                  <input
                    type='text'
                    value={data.recipientPostal}
                    onChange={(e) =>
                      handleInputChange('envelope_com10', 'recipientPostal', e.target.value)
                    }
                    className='w-full p-2 border border-gray-300 rounded-md text-sm text-sm'
                  />
                </div>
              </div>
            </div>
            <div>
              <h4 className='font-medium mb-2'>Remetente</h4>
              <div className='space-y-2'>
                <div>
                  <label className='block text-sm font-medium mb-1'>Nome</label>
                  <input
                    type='text'
                    value={data.senderName}
                    onChange={(e) =>
                      handleInputChange('envelope_com10', 'senderName', e.target.value)
                    }
                    className='w-full p-2 border border-gray-300 rounded-md text-sm text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>Endereço</label>
                  <input
                    type='text'
                    value={data.senderAddress}
                    onChange={(e) =>
                      handleInputChange('envelope_com10', 'senderAddress', e.target.value)
                    }
                    className='w-full p-2 border border-gray-300 rounded-md text-sm text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>Código Postal</label>
                  <input
                    type='text'
                    value={data.senderPostal}
                    onChange={(e) =>
                      handleInputChange('envelope_com10', 'senderPostal', e.target.value)
                    }
                    className='w-full p-2 border border-gray-300 rounded-md text-sm text-sm'
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'ctt_aviso_rec':
        return (
          <div className='space-y-4'>
            <div className='border-b border-dashed border-gray-400 pb-4'>
              <h4 className='font-medium mb-2'>Destinatário</h4>
              <div className='space-y-2'>
                <div>
                  <label className='block text-sm font-medium mb-1'>Nome</label>
                  <input
                    type='text'
                    value={data.name}
                    onChange={(e) => handleInputChange('ctt_aviso_rec', 'name', e.target.value)}
                    className='w-full p-2 border border-gray-300 rounded-md text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>Endereço Linha 1</label>
                  <input
                    type='text'
                    value={data.address}
                    onChange={(e) => handleInputChange('ctt_aviso_rec', 'address', e.target.value)}
                    className='w-full p-2 border border-gray-300 rounded-md text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>Endereço Linha 2</label>
                  <input
                    type='text'
                    value={data.address2}
                    onChange={(e) => handleInputChange('ctt_aviso_rec', 'address2', e.target.value)}
                    className='w-full p-2 border border-gray-300 rounded-md text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>País</label>
                  <input
                    type='text'
                    value={data.country}
                    onChange={(e) => handleInputChange('ctt_aviso_rec', 'country', e.target.value)}
                    className='w-full p-2 border border-gray-300 rounded-md text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>Código Postal e Cidade</label>
                  <input
                    type='text'
                    value={data.postalCodeAndCity}
                    onChange={(e) =>
                      handleInputChange('ctt_aviso_rec', 'postalCodeAndCity', e.target.value)
                    }
                    className='w-full p-2 border border-gray-300 rounded-md text-sm'
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className='font-medium mb-2'>Remetente</h4>
              <div className='space-y-2'>
                <div>
                  <label className='block text-sm font-medium mb-1'>Nome</label>
                  <input
                    type='text'
                    value={data.senderName}
                    onChange={(e) =>
                      handleInputChange('ctt_aviso_rec', 'senderName', e.target.value)
                    }
                    className='w-full p-2 border border-gray-300 rounded-md text-sm text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>Endereço</label>
                  <input
                    type='text'
                    value={data.senderAddress}
                    onChange={(e) =>
                      handleInputChange('ctt_aviso_rec', 'senderAddress', e.target.value)
                    }
                    className='w-full p-2 border border-gray-300 rounded-md text-sm text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>País</label>
                  <input
                    type='text'
                    value={data.senderCountry}
                    onChange={(e) =>
                      handleInputChange('ctt_aviso_rec', 'senderCountry', e.target.value)
                    }
                    className='w-full p-2 border border-gray-300 rounded-md text-sm text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-1'>Código Postal e Cidade</label>
                  <div className='flex gap-[10px]'>
                    <input
                      type='text'
                      value={data.senderPostalCode}
                      onChange={(e) =>
                        handleInputChange('ctt_aviso_rec', 'senderPostalCode', e.target.value)
                      }
                      className='min-w-0 w-[120px] p-2 border border-gray-300 rounded-md'
                    />
                    <input
                      type='text'
                      value={data.senderPostalCode2}
                      onChange={(e) =>
                        handleInputChange('ctt_aviso_rec', 'senderPostalCode2', e.target.value)
                      }
                      className='min-w-0 w-[80px] p-2 border border-gray-300 rounded-md'
                    />
                    <input
                      type='text'
                      value={data.senderCity}
                      onChange={(e) =>
                        handleInputChange('ctt_aviso_rec', 'senderCity', e.target.value)
                      }
                      className='min-w-0 w-[140px] p-2 border border-gray-300 rounded-md'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className='mx-auto p-6 bg-gray-50 min-h-screen'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>
          RH Torrestir - Serviço de Impressão
        </h1>
        <p className='text-gray-600'>Seleciona um template e edita as informações.</p>
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
            <h2 className='text-lg font-semibold mb-4'>Editar Template</h2>
            {renderEditForm()}
            <button
              onClick={handlePrint}
              className='w-full mt-6 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2'
            >
              <Printer size={18} />
              Imprimir
            </button>
          </div>
        </div>

        {/* Template Preview */}
        <div className='lg:col-span-2'>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-lg font-semibold mb-4'>Pré-Visualizar</h2>
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
          width: ${getPrintSizesW()} !important;
          height: ${getPrintSizesH()} !important;
        }

        @page {
          margin: 0;
          size: ${getPageSize()};
        }
      }
    `,
        }}
      />
    </div>
  );
};

export default Home;
