function calculateShippingFormSizeValues(
  { weightKg, lengthCm, widthCm, heightCm, cbm },
  volumetricRatio = 333,
) {
  let calculatedCBM = cbm;

  if ((lengthCm || lengthCm === 0) && (widthCm || widthCm === 0) && (heightCm || heightCm === 0)) {
    console.log('Dimensions:', { lengthCm, widthCm, heightCm }); // Add this
    console.log('Types:', typeof lengthCm, typeof widthCm, typeof heightCm); // Add this
    calculatedCBM = (lengthCm * widthCm * heightCm) / 1_000_000;
    console.log('Raw CBM:', calculatedCBM); // Add this
  }

  const volumetricWeight = calculatedCBM * volumetricRatio;
  const taxableWeight = Math.max(weightKg, volumetricWeight);

  return {
    ...(!cbm && { CBM: Number(calculatedCBM.toFixed(2)) }),
    TaxableWeight: Number(taxableWeight.toFixed(2)),
  };
}

export default calculateShippingFormSizeValues;
