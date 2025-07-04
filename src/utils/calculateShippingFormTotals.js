function calculateShippingFormTotals(packages) {
  const totals = {
    totalWeight: 0,
    totalCBM: 0,
    totalLDM: 0,
    totalTaxableWeight: 0,
    quantityByType: {}, // e.g., { volume: 3, palete: 2 }
  };

  console.log('total before: ', totals);

  for (const pkg of packages) {
    const weight = parseFloat(pkg.packageWeight);
    const cbm = parseFloat(pkg.CBM);
    const ldm = parseFloat(pkg.LDM);
    const taxableWeight = parseFloat(pkg.TaxableWeight);
    const type = pkg.packageType;

    // Count quantity by packageType
    if (!totals.quantityByType[type]) {
      totals.quantityByType[type] = 0;
    }

    totals.quantityByType[type] += 1;

    console.log('total afater: ', totals);

    if (!isNaN(weight)) {
      totals.totalWeight += weight;
    }

    if (!isNaN(cbm)) {
      totals.totalCBM += cbm;
    }

    if (!isNaN(ldm)) {
      totals.totalLDM += ldm;
    }

    if (!isNaN(taxableWeight)) {
      totals.totalTaxableWeight += taxableWeight;
    }
  }

  return totals;
}

export default calculateShippingFormTotals;
