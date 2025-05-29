function calculateShippingFormSizeValues(
  weightKg,
  lengthCm,
  widthCm,
  heightCm,
  volumetricRatio = 333, // 333 for international, 250 for national
) {
  const cbm = (lengthCm * widthCm * heightCm) / 1_000_000;
  const volumetricWeight = cbm * volumetricRatio;
  const taxableWeight = Math.max(weightKg, volumetricWeight);

  return {
    CBM: Number(cbm.toFixed(2)),
    TaxableWeight: Number(taxableWeight.toFixed(2)),
  };
}

export default calculateShippingFormSizeValues;
