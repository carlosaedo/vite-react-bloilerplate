import React, { useState, useEffect } from 'react';
import { TextField, Grid, Typography, Box } from '@mui/material';

import calculateShippingFormSizeValues from '../../utils/calculateShippingFormSizeShippingForm';

import sanitizeDecimalInput from '../../utils/sanitizeDecimalInput';

const ShippingFormInputs = ({ onChange, packageIndex }) => {
  const [inputs, setInputs] = useState({
    packageWeight: '',
    packageLength: '',
    packageWidth: '',
    packageHeight: '',
    CBM: '',
    LDM: '',
  });

  const [calculated, setCalculated] = useState({
    CBM: '',
    TaxableWeight: '',
  });

  const parseNumber = (value) => {
    if (typeof value !== 'string') return NaN;
    return parseFloat(value.replace(',', '.'));
  };

  useEffect(() => {
    const weight = parseNumber(inputs.packageWeight);
    const cbmManual = inputs.CBM !== '';
    const ldmManual = inputs.LDM !== '';

    const length = parseNumber(inputs.packageLength);
    const width = parseNumber(inputs.packageWidth);
    const height = parseNumber(inputs.packageHeight);

    let newCalculated = { CBM: '', TaxableWeight: '' };

    if (!isNaN(weight)) {
      if (cbmManual) {
        const CBM = parseNumber(inputs.CBM);
        if (!isNaN(CBM)) {
          newCalculated = calculateShippingFormSizeValues({ weightKg: weight, cbm: CBM });
        }
      } else if (!isNaN(length) && !isNaN(width) && !isNaN(height)) {
        console.log(
          'Calculating dimensions',
          'W: ',
          weight,
          'L: ',
          length,
          'W: ',
          width,
          'H: ',
          height,
        );
        newCalculated = calculateShippingFormSizeValues({
          weightKg: weight,
          lengthCm: length,
          widthCm: width,
          heightCm: height,
        });
      } else if (ldmManual) {
        const LDM = parseNumber(inputs.LDM);
        if (!isNaN(LDM)) {
          const volumetricWeight = LDM * 333;
          newCalculated = { TaxableWeight: Number(Math.max(weight, volumetricWeight).toFixed(2)) };
        }
      }
    }

    setCalculated(newCalculated);

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

      if (field === 'CBM' && value !== '') {
        // Manual CBM entered → clear dimensions and LDM
        newInputs.packageLength = '';
        newInputs.packageWidth = '';
        newInputs.packageHeight = '';
        newInputs.LDM = '';
      }

      if (field === 'LDM' && value !== '') {
        // Manual LDM entered → clear dimensions and CBM
        newInputs.packageLength = '';
        newInputs.packageWidth = '';
        newInputs.packageHeight = '';
        newInputs.CBM = '';
      }

      // If a dimension is entered → clear CBM and LDM
      if (['packageHeight', 'packageWidth', 'packageLength'].includes(field) && value !== '') {
        newInputs.CBM = '';
        newInputs.LDM = '';
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
            value={inputs.packageWeight}
            onChange={handleChange('packageWeight')}
            onKeyDown={handleKeyDown('packageWeight')}
            fullWidth
            slotProps={{ htmlInput: { inputMode: 'decimal' } }}
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
          <TextField
            label='Height (cm)'
            value={inputs.packageHeight}
            onChange={handleChange('packageHeight')}
            onKeyDown={handleKeyDown('packageHeight')}
            fullWidth
            slotProps={{ htmlInput: { inputMode: 'decimal' } }}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
          <TextField
            label='Width (cm)'
            value={inputs.packageWidth}
            onChange={handleChange('packageWidth')}
            onKeyDown={handleKeyDown('packageWidth')}
            fullWidth
            slotProps={{ htmlInput: { inputMode: 'decimal' } }}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
          <TextField
            label='Length (cm)'
            value={inputs.packageLength}
            onChange={handleChange('packageLength')}
            onKeyDown={handleKeyDown('packageLength')}
            fullWidth
            slotProps={{ htmlInput: { inputMode: 'decimal' } }}
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
          <TextField
            label='CBM (manual)'
            value={inputs.CBM}
            onChange={handleChange('CBM')}
            onKeyDown={handleKeyDown('CBM')}
            fullWidth
            slotProps={{ htmlInput: { inputMode: 'decimal' } }}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
          <TextField
            label='LDM (manual)'
            value={inputs.LDM}
            onChange={handleChange('LDM')}
            onKeyDown={handleKeyDown('LDM')}
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
