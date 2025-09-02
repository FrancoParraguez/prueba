export const validatePlateNumber = (plateNumber: string): boolean => {
  // Basic validation for plate numbers (adjust according to your country's format)
  const plateRegex = /^[A-Z0-9]{6,8}$/;
  return plateRegex.test(plateNumber);
};

export const formatPlateNumber = (plateNumber: string): string => {
  return plateNumber.replace(/\s+/g, '').toUpperCase();
};