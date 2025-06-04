import React, { useState, useEffect } from 'react';
import { TextField, Grid, Typography, Box } from '@mui/material';

import calculateShippingFormSizeValues from '../../utils/calculateShippingFormSizeShippingForm';

import sanitizeDecimalInput from '../../utils/sanitizeDecimalInput';

const ShippingFormInputs = ({ onChange }) => {
  const [inputs, setInputs] = useState({
    weightKg: '',
    lengthCm: '',
    widthCm: '',
    heightCm: '',
    cbm: '',
    ldm: '',
  });

  console.log(inputs);

  const [calculated, setCalculated] = useState({
    CBM: '',
    TaxableWeight: '',
  });

  console.log(calculated);

  const parseNumber = (value) => {
    if (typeof value !== 'string') return NaN;
    return parseFloat(value.replace(',', '.'));
  };

  useEffect(() => {
    const weight = parseNumber(inputs.weightKg);
    const cbmManual = inputs.cbm !== '';
    const ldmManual = inputs.ldm !== '';

    const length = parseNumber(inputs.lengthCm);
    const width = parseNumber(inputs.widthCm);
    const height = parseNumber(inputs.heightCm);

    if (isNaN(weight)) return;

    if (cbmManual) {
      const cbm = parseNumber(inputs.cbm);
      if (!isNaN(cbm)) {
        setCalculated(calculateShippingFormSizeValues({ weightKg: weight, cbm }));
        return;
      }
    } else if (!isNaN(length) && !isNaN(width) && !isNaN(height)) {
      setCalculated(
        calculateShippingFormSizeValues({
          weightKg: weight,
          lengthCm: length,
          widthCm: width,
          heightCm: height,
        }),
      );
      return;
    } else if (ldmManual) {
      const ldm = parseNumber(inputs.ldm);
      if (!isNaN(ldm)) {
        const volumetricWeight = ldm * 333;
        setCalculated({ TaxableWeight: Number(Math.max(weight, volumetricWeight).toFixed(2)) });
        return;
      }
    }

    // Not enough data → clear calculated values
    setCalculated({ CBM: '', TaxableWeight: '' });

    // Notify parent component of changes
    if (onChange) {
      onChange({ inputs, calculated: newCalculated });
    }
  }, [inputs, onChange]);

  const handleChange = (field) => (e) => {
    let value = e.target.value;

    value = sanitizeDecimalInput(value); // Filter unwanted characters

    setInputs((prev) => {
      const newInputs = { ...prev, [field]: value };

      if (field === 'cbm' && value !== '') {
        // Manual CBM entered → clear dimensions and LDM
        newInputs.lengthCm = '';
        newInputs.widthCm = '';
        newInputs.heightCm = '';
        newInputs.ldm = '';
      }

      if (field === 'ldm' && value !== '') {
        // Manual LDM entered → clear dimensions and CBM
        newInputs.lengthCm = '';
        newInputs.widthCm = '';
        newInputs.heightCm = '';
        newInputs.cbm = '';
      }

      // If a dimension is entered → clear CBM and LDM
      if (['heightCm', 'widthCm', 'lengthCm'].includes(field) && value !== '') {
        newInputs.cbm = '';
        newInputs.ldm = '';
      }

      return newInputs;
    });
  };

  const handleKeyDown = (field) => (e) => {
    if (e.key === 'Delete') {
      setInputs((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Box p={2}>
      <Typography variant='h6'>Shipping Form Keyboard Test</Typography>
      <Grid container spacing={2} mt={1}>
        <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
          <TextField
            label='Weight (kg)'
            value={inputs.weightKg}
            onChange={handleChange('weightKg')}
            onKeyDown={handleKeyDown('weightKg')}
            fullWidth
            slotProps={{ htmlInput: { inputMode: 'decimal' } }}
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
          <TextField
            label='Height (cm)'
            value={inputs.heightCm}
            onChange={handleChange('heightCm')}
            onKeyDown={handleKeyDown('heightCm')}
            fullWidth
            slotProps={{ htmlInput: { inputMode: 'decimal' } }}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
          <TextField
            label='Width (cm)'
            value={inputs.widthCm}
            onChange={handleChange('widthCm')}
            onKeyDown={handleKeyDown('widthCm')}
            fullWidth
            slotProps={{ htmlInput: { inputMode: 'decimal' } }}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
          <TextField
            label='Length (cm)'
            value={inputs.lengthCm}
            onChange={handleChange('lengthCm')}
            onKeyDown={handleKeyDown('lengthCm')}
            fullWidth
            slotProps={{ htmlInput: { inputMode: 'decimal' } }}
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
          <TextField
            label='CBM (manual)'
            value={inputs.cbm}
            onChange={handleChange('cbm')}
            onKeyDown={handleKeyDown('cbm')}
            fullWidth
            slotProps={{ htmlInput: { inputMode: 'decimal' } }}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
          <TextField
            label='LDM (manual)'
            value={inputs.ldm}
            onChange={handleChange('ldm')}
            onKeyDown={handleKeyDown('ldm')}
            fullWidth
            slotProps={{ htmlInput: { inputMode: 'decimal' } }}
          />
        </Grid>

        {calculated.CBM && (
          <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
            <Typography variant='body1' sx={{ mt: 2 }}>
              <strong>CBM (calculated):</strong> {calculated.CBM}
            </Typography>
          </Grid>
        )}

        {calculated.TaxableWeight && (
          <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
            <Typography variant='body1' sx={{ mt: 2 }}>
              <strong>Taxable Weight:</strong> {calculated.TaxableWeight}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ShippingFormInputs;
