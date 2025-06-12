import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  Grid,
  Chip,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
  Link as MuiLink,
  Button,
} from '@mui/material';
const EditShippingFormSinglePage = () => {
  const { state: form } = useLocation();
  const navigateTo = useNavigate();

  console.log(form);
  return (
    <div>
      <h2>Editing: {form?.trackingNumber}</h2>

      <Button onClick={() => navigateTo(-1)}>Go Back</Button>
    </div>
  );
};

export default EditShippingFormSinglePage;
