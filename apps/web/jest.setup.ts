import '@testing-library/jest-dom';
import { jest, expect } from '@jest/globals';


Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: jest.fn<(key: string) => string | null>(),
    setItem: jest.fn<(key: string, value: string) => void>(),
    removeItem: jest.fn<(key: string) => void>(),
    clear: jest.fn<() => void>(),
  },
  writable: true
});


expect.extend({
  toEqualWithDatePrecision(received: any, expected: any, precision: number = 0) {
    const pass = this.equals(
      JSON.parse(JSON.stringify(received), (key, value) => 
        typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value) 
          ? value.slice(0, 19 + precision) 
          : value
      ),
      JSON.parse(JSON.stringify(expected), (key, value) => 
        typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value) 
          ? value.slice(0, 19 + precision) 
          : value
      )
    );

    return {
      message: () =>
        `expected ${this.utils.printReceived(received)} to equal ${this.utils.printExpected(expected)} with date precision of ${precision} decimal places`,
      pass,
    };
  },
});