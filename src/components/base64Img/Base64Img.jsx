import React, { useState } from 'react';
import useZebraBrowserPrint from '../hooks/useZebraBrowserPrint';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Modal,
  IconButton,
  Button,
  Fade,
  Backdrop,
} from '@mui/material';
import { Close as CloseIcon, Print as PrintIcon } from '@mui/icons-material';

export default function RotatedImage({ base64, zpl, label = 'Label' }) {
  const [open, setOpen] = useState(false);
  useZebraBrowserPrint();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePrint = () => {
    // Create a canvas to draw the rotated image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Set canvas size for rotated image (swap width/height)
      canvas.width = img.width;
      canvas.height = img.height;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Rotate and draw image
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      //ctx.rotate(Math.PI / 2); // 90 degrees
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      // Convert canvas to blob and create URL
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);

        // Create a simple print window
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Print Image</title>
                <style>
                  body {
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                  }
                  img {
                    max-width: 100%;
                    max-height: 100vh;
                    object-fit: contain;
                  }
                  @media print {
                    body { margin: 0; padding: 0; }
                  }
                </style>
              </head>
              <body>
                <img src="${url}" alt="${label}" onload="setTimeout(() => { window.print(); }, 100);" />
              </body>
            </html>
          `);
          printWindow.document.close();

          // Clean up the blob URL after a delay
          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 5000);
        }
      }, 'image/png');
    };

    img.src = `data:image/png;base64,${base64}`;
  };

  const handlePrintZpl = () => {
    if (!zpl) return;

    if (window.BrowserPrint) {
      window.BrowserPrint.getDefaultDevice('printer', function (printer) {
        if (!printer) {
          alert('No printer found');
          return;
        }

        printer.send(
          zpl,
          function () {
            console.log('Print sent successfully');
          },
          function (error) {
            console.error('Print failed', error);
          },
        );
      });
    } else {
      alert(
        'Zebra Browser Print not available. Is it installed and running? Go to: https://www.zebra.com/us/en/software/printer-software.html',
      );
    }
  };

  const printString = () => {
    const printWindow = window.open('', '_blank', 'width=1,height=1');
    printWindow.document.write(`<pre style="margin:0">${zpl}</pre>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (!base64) return null;

  return (
    <>
      {/* Compact Card */}
      <Card
        variant='elevation'
        elevation={1}
        onClick={handleOpen}
        sx={{
          maxWidth: 200,
          mx: 'auto',
          borderRadius: 2,
          p: 1,
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: 4,
            transform: 'translateY(-2px)',
          },
        }}
      >
        <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
          <Typography variant='caption' gutterBottom sx={{ fontSize: '0.75rem' }}>
            {label}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              height: 60,
              borderRadius: 1,
              bgcolor: 'grey.50',
            }}
          >
            <Box
              component='img'
              src={`data:image/png;base64,${base64}`}
              alt='Thumbnail'
              sx={{
                //transform: 'rotate(90deg)',
                //transformOrigin: 'center center',
                height: 60,
                width: 'auto',
                maxWidth: 80,
                objectFit: 'contain',
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{
          backdrop: Backdrop,
        }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90vw',
              height: '90vh',
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant='h6'>{label}</Typography>
              <Box>
                <IconButton onClick={handlePrint} sx={{ mr: 1 }} color='primary'>
                  <PrintIcon /> IMG
                </IconButton>
                <IconButton onClick={handlePrintZpl} sx={{ mr: 1 }} color='primary'>
                  <PrintIcon /> ZPL
                </IconButton>
                <IconButton onClick={printString} sx={{ mr: 1 }} color='primary'>
                  <PrintIcon /> String
                </IconButton>
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Image Container */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                bgcolor: 'grey.50',
                borderRadius: 1,
              }}
            >
              <Box
                component='img'
                src={`data:image/png;base64,${base64}`}
                alt={label}
                sx={{
                  //transform: 'rotate(90deg)',
                  //transformOrigin: 'center center',
                  maxHeight: 'calc(90vh - 120px)',
                  maxWidth: 'calc(90vw - 40px)',
                  objectFit: 'contain',
                }}
              />
            </Box>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
