module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint'],
  '**/*.ts?(x)': () => 'npm run check-types',
};
