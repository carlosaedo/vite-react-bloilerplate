function calculateShippingFormTotals(packages) {
  const totals = {
    totalQuantity: 0,
    totalWeight: 0,
    totalCBM: 0,
    totalLDM: 0,
    totalTaxableWeight: 0,
    quantityByType: {}, // e.g., { volume: 3, palete: 2 }
  };

  for (const pkg of packages) {
    const quantity = parseFloat(pkg.packageQuantity);
    const weight = parseFloat(pkg.packageWeight);
    const cbm = parseFloat(pkg.CBM);
    const ldm = parseFloat(pkg.LDM);
    const taxableWeight = parseFloat(pkg.TaxableWeight);
    const type = pkg.packageType;

    if (!isNaN(quantity)) {
      totals.totalQuantity += quantity;

      // Count quantity by packageType
      if (!totals.quantityByType[type]) {
        totals.quantityByType[type] = 0;
      }
      totals.quantityByType[type] += quantity;
    }

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
