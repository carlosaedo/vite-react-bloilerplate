function calculateShippingFormSizeValues(
  weightKg,
  lengthCm,
  widthCm,
  heightCm,
  volumetricDivisor = 5000,
) {
  const cbm = (lengthCm * widthCm * heightCm) / 1_000_000;
  const ldm = lengthCm / 100;
  const volumetricWeight = (lengthCm * widthCm * heightCm) / volumetricDivisor;
  const taxableWeight = Math.max(weightKg, volumetricWeight);

  return {
    CBM: Number(cbm.toFixed(2)),
    LDM: Number(ldm.toFixed(2)),
    TaxableWeight: Number(taxableWeight.toFixed(2)),
  };
}

export default calculateShippingFormSizeValues;
