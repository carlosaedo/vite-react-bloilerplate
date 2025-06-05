function calculateShippingFormSizeValues(
  { weightKg, lengthCm, widthCm, heightCm, cbm },
  volumetricRatio = 333,
) {
  let calculatedCBM = cbm;

  if ((lengthCm || lengthCm === 0) && (widthCm || widthCm === 0) && (heightCm || heightCm === 0)) {
    console.log('Dimensions:', { lengthCm, widthCm, heightCm });
    console.log('Types:', typeof lengthCm, typeof widthCm, typeof heightCm);
    calculatedCBM = (lengthCm * widthCm * heightCm) / 1_000_000;
    console.log('Raw CBM:', calculatedCBM);
  }

  const volumetricWeight = calculatedCBM * volumetricRatio;
  const taxableWeight = Math.max(weightKg, volumetricWeight);

  return {
    ...(!cbm && { CBM: Number(calculatedCBM.toFixed(2)) }),
    TaxableWeight: Number(taxableWeight.toFixed(2)),
  };
}

function calculateShippingFormSizeValuesLDM({ weightKg, ldm }, volumetricRatio = 333) {
  const volumetricWeight = ldm * volumetricRatio;
  const taxableWeight = Math.max(weightKg, volumetricWeight);

  return {
    TaxableWeight: Number(taxableWeight.toFixed(2)),
  };
}

export { calculateShippingFormSizeValues, calculateShippingFormSizeValuesLDM };
