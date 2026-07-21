export const formatCurrency = (value) => {
  if (value === undefined || value === null) return '₹0';
  
  if (value >= 10000000) {
    // Crores
    const crores = value / 10000000;
    return `₹${crores % 1 === 0 ? crores : crores.toFixed(2)} Crore`;
  } else if (value >= 100000) {
    // Lacs
    const lacs = value / 100000;
    return `₹${lacs % 1 === 0 ? lacs : lacs.toFixed(2)} Lac`;
  }
  
  // Format smaller numbers standardly with Indian locale
  return `₹${value.toLocaleString('en-IN')}`;
};
