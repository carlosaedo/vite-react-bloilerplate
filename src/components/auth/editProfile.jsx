import { useState, useEffect, useRef, use } from 'react';
import torrestirApi from '../api/torrestirApi';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import {
  Box,
  Button,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { Person as PersonIcon, PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';

import Message from '../messages/Message';
import ErrorMessage from '../messages/ErrorMessage';

const EditProfile = () => {
  const navigateTo = useNavigate();
  const { token, userId, avatar, setAvatar } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    avatar: null,
  });
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [cropArea, setCropArea] = useState({ x: 50, y: 50, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    if (avatar) {
      setFormData((prev) => ({
        ...prev,
        avatar,
      }));
    }
  }, [userId, token]);

  async function handleProfileChange() {
    try {
      const response = await torrestirApi.post('/profile', formData);
      console.log(response);
      if (
        response?.status === 200 &&
        response?.data?.message === 'Password atualizada com sucesso.'
      ) {
        setMessage('Password atualizada com sucesso.');
        setTimeout(() => {
          navigateTo('/login');
        }, 1000);
      } else {
        setErrorMessage('Algo correu mal.');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setErrorMessage('Este email não está registado');
      } else if (
        error.response?.status === 400 &&
        error.response?.data?.error === 'Código inválido ou expirado.'
      ) {
        setErrorMessage('Código inválido ou expirado.');
      } else {
        console.error(error);
      }
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    await handleProfileChange();
  };

  const handleChange = (event) => {
    setMessage(null);
    setErrorMessage(null);
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);

        setCropDialogOpen(true);

        // Load image to get dimensions
        const img = new Image();
        img.onload = () => {
          const maxWidth = 500;
          const maxHeight = 400;
          let { width, height } = img;

          // Scale image to fit dialog while maintaining aspect ratio
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }

          setImageSize({ width, height });
          // Set initial crop area to center square
          const cropSize = Math.min(width, height) * 0.6;
          setCropArea({
            x: (width - cropSize) / 2,
            y: (height - cropSize) / 2,
            width: cropSize,
            height: cropSize,
          });
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileAvatarUpload = async (croppedBlob) => {
    try {
      const formData = new FormData();
      formData.append('file', croppedBlob, 'avatar.jpg');

      const response = await torrestirApi.post('/api/cdn/avatar/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);

      if (response.status === 200) {
        setMessage('Avatar uploaded successfully!');
        // Optionally update the formData with the returned avatar URL
        if (response.data?.avatarUrl) {
          setFormData((prev) => ({
            ...prev,
            avatar: response.data.avatarUrl,
          }));
        }
      } else {
        setErrorMessage('Failed to upload avatar.');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      if (error.response?.status === 413) {
        setErrorMessage('Image file is too large.');
      } else if (error.response?.status === 400) {
        setErrorMessage('Invalid image format.');
      } else {
        setErrorMessage('Failed to upload avatar. Please try again.');
      }
    }
  };

  const handleMouseDown = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on resize handle (bottom-right corner)
    const handleSize = 10;
    const isOnHandle =
      x >= cropArea.x + cropArea.width - handleSize &&
      x <= cropArea.x + cropArea.width + handleSize &&
      y >= cropArea.y + cropArea.height - handleSize &&
      y <= cropArea.y + cropArea.height + handleSize;

    if (isOnHandle) {
      setIsResizing(true);
      setDragStart({ x, y });
    } else if (
      x >= cropArea.x &&
      x <= cropArea.x + cropArea.width &&
      y >= cropArea.y &&
      y <= cropArea.y + cropArea.height
    ) {
      // Clicking inside crop area - start dragging
      setIsDragging(true);
      setDragStart({ x: x - cropArea.x, y: y - cropArea.y });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging && !isResizing) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging) {
      const newX = Math.max(0, Math.min(x - dragStart.x, imageSize.width - cropArea.width));
      const newY = Math.max(0, Math.min(y - dragStart.y, imageSize.height - cropArea.height));

      setCropArea((prev) => ({
        ...prev,
        x: newX,
        y: newY,
      }));
    } else if (isResizing) {
      // Calculate new size but maintain 1:1 aspect ratio
      const deltaX = x - cropArea.x;
      const deltaY = y - cropArea.y;
      // Use the maximum of the two deltas to allow growing in both directions
      const newSize = Math.max(deltaX, deltaY);

      // Ensure minimum size
      const constrainedSize = Math.max(50, newSize);

      // Make sure the square doesn't go outside image bounds
      const maxSizeX = imageSize.width - cropArea.x;
      const maxSizeY = imageSize.height - cropArea.y;
      const maxSize = Math.min(maxSizeX, maxSizeY);

      const finalSize = Math.min(constrainedSize, maxSize);

      setCropArea((prev) => ({
        ...prev,
        width: finalSize,
        height: finalSize,
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleCropConfirm = () => {
    if (selectedImage) {
      // Create a canvas to crop the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate scale factor between displayed image and original image
        const scaleX = img.width / imageSize.width;
        const scaleY = img.height / imageSize.height;

        canvas.width = cropArea.width;
        canvas.height = cropArea.height;

        ctx.drawImage(
          img,
          cropArea.x * scaleX,
          cropArea.y * scaleY,
          cropArea.width * scaleX,
          cropArea.height * scaleY,
          0,
          0,
          cropArea.width,
          cropArea.height,
        );

        // Convert canvas to blob and upload
        canvas.toBlob(
          async (blob) => {
            if (blob) {
              // Upload to API
              await handleProfileAvatarUpload(blob);

              // Also set local preview
              const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
              setAvatar(croppedDataUrl);
              setFormData((prev) => ({
                ...prev,
                avatar: croppedDataUrl,
              }));
            }
          },
          'image/jpeg',
          0.8,
        );

        setCropDialogOpen(false);
        setSelectedImage(null);
      };

      img.src = selectedImage;
    }
  };

  const handleCropCancel = () => {
    setCropDialogOpen(false);
    setSelectedImage(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'top',
        padding: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <Typography variant='h5' gutterBottom>
          Edit Profile
        </Typography>

        <Box
          component='form'
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <ErrorMessage errorMessage={errorMessage} />
          <Message message={message} />

          {/* Avatar Section */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar src={formData.avatar || undefined} sx={{ width: 100, height: 100 }}>
                {!formData.avatar && <PersonIcon sx={{ fontSize: 50 }} />}
              </Avatar>

              <Button
                variant='contained'
                component='label'
                sx={{
                  position: 'absolute',
                  bottom: -8,
                  right: -8,
                  minWidth: 'auto',
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  padding: 0,
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                <PhotoCameraIcon sx={{ fontSize: 16 }} />
                <input type='file' accept='image/*' hidden onChange={handleAvatarChange} />
              </Button>
            </Box>
          </Box>

          <Button type='submit' variant='contained' color='primary'>
            Save changes
          </Button>
        </Box>
      </Box>

      {/* Crop Dialog */}
      <Dialog open={cropDialogOpen} onClose={handleCropCancel} maxWidth='md' fullWidth>
        <DialogTitle>Crop Image</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            {selectedImage && (
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-block',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  userSelect: 'none',
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img
                  ref={imageRef}
                  src={selectedImage}
                  alt='Preview'
                  style={{
                    width: `${imageSize.width}px`,
                    height: `${imageSize.height}px`,
                    objectFit: 'contain',
                    display: 'block',
                  }}
                  draggable={false}
                />

                {/* Crop overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    border: '2px solid #1976d2',
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                    left: `${cropArea.x}px`,
                    top: `${cropArea.y}px`,
                    width: `${cropArea.width}px`,
                    height: `${cropArea.height}px`,
                    cursor: isDragging ? 'grabbing' : 'grab',
                    pointerEvents: 'none',
                  }}
                />

                {/* Resize handle */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#1976d2',
                    left: `${cropArea.x + cropArea.width - 5}px`,
                    top: `${cropArea.y + cropArea.height - 5}px`,
                    cursor: 'nw-resize',
                    pointerEvents: 'all',
                  }}
                />

                {/* Dark overlay for non-cropped areas */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    clipPath: `polygon(
                      0% 0%,
                      ${cropArea.x}px 0%,
                      ${cropArea.x}px ${cropArea.y}px,
                      ${cropArea.x + cropArea.width}px ${cropArea.y}px,
                      ${cropArea.x + cropArea.width}px ${cropArea.y + cropArea.height}px,
                      ${cropArea.x}px ${cropArea.y + cropArea.height}px,
                      ${cropArea.x}px 100%,
                      0% 100%
                    ), polygon(
                      ${cropArea.x + cropArea.width}px 0%,
                      100% 0%,
                      100% 100%,
                      ${cropArea.x + cropArea.width}px 100%
                    ), polygon(
                      ${cropArea.x}px ${cropArea.y + cropArea.height}px,
                      ${cropArea.x + cropArea.width}px ${cropArea.y + cropArea.height}px,
                      ${cropArea.x + cropArea.width}px 100%,
                      ${cropArea.x}px 100%
                    )`,
                    pointerEvents: 'none',
                  }}
                />
              </Box>
            )}
          </Box>

          <Typography variant='body2' sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
            Drag to move • Drag corner to resize (1:1 ratio)
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCropCancel}>Cancel</Button>
          <Button onClick={handleCropConfirm} variant='contained'>
            Confirm Crop
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditProfile;
