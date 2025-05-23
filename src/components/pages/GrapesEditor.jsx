import React, { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';

const GrapesEditor = () => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    editorRef.current = grapesjs.init({
      container: containerRef.current,
      height: '600px',
      fromElement: false,
      storageManager: false,
      // You can customize blocks here or load plugins
      blockManager: {
        appendTo: '#blocks',
        blocks: [
          {
            id: 'section',
            label: '<b>Section</b>',
            content: `<section style="padding:20px; background: #f5f5f5;">
                        <h2>This is a Section block</h2>
                      </section>`,
          },
          {
            id: 'text',
            label: 'Text',
            content: '<div data-gjs-type="text">Insert your text here</div>',
          },
          // Add more blocks or custom components here
        ],
      },
      styleManager: {
        clearProperties: true,
        sectors: [
          {
            name: 'Dimension',
            properties: [
              { name: 'Width', property: 'width' },
              { name: 'Height', property: 'height' },
              { name: 'Max Width', property: 'max-width' },
              { name: 'Min Height', property: 'min-height' },
            ],
          },
          {
            name: 'Typography',
            open: false,
            properties: [
              { name: 'Font', property: 'font-family' },
              { name: 'Font Size', property: 'font-size' },
              { name: 'Font Weight', property: 'font-weight' },
              { name: 'Letter Spacing', property: 'letter-spacing' },
              { name: 'Color', property: 'color' },
            ],
          },
        ],
      },
    });

    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, []);

  return (
    <div style={{ display: 'flex', height: '600px' }}>
      <div id='blocks' style={{ width: '200px', borderRight: '1px solid #ddd' }}></div>
      <div ref={containerRef} style={{ flexGrow: 1 }} />
    </div>
  );
};

export default GrapesEditor;
