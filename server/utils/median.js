module.exports = (values) => {
  values.sort((a, b) => a - b);
  if (values.length === 0) return 0;
  const half = Math.floor(values.length / 2);
  if (values.length % 2) return values[half];
  return (values[half - 1] + values[half]) / 2.0;
};
