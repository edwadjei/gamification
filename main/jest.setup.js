// Silence console logs during tests
console.log = jest.fn();
console.error = jest.fn();

// Increase timeout for async tests
jest.setTimeout(10000);
