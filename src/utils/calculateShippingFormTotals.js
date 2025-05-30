function calculateShippingFormTotals(packages) {
  const totalQuantity = packages.reduce((sum, pkg) => {
    const quantity = parseFloat(pkg.packageQuantity);
    return sum + (isNaN(quantity) ? 0 : quantity);
  }, 0);

  const totalWeight = packages.reduce((sum, pkg) => {
    const weight = parseFloat(pkg.packageWeight);
    return sum + (isNaN(weight) ? 0 : weight);
  }, 0);

  return {
    totalQuantity,
    totalWeight,
  };
}

export default calculateShippingFormTotals;
