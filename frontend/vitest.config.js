import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.{js,jsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'lcov', 'json-summary'],
      reportsDirectory: 'coverage',
      // Only logic that is unit-tested today; widen as more tests are added.
      include: [
        'src/shared/utils/validators.js',
        'src/shared/utils/formatters.js',
        'src/shared/utils/zodResolver.js',
        'src/feature/checkout/checkoutSchema.js',
        'src/feature/checkout/services/**/*.js',
      ],
      thresholds: { lines: 80, functions: 80, statements: 80, branches: 70 },
    },
  },
});
