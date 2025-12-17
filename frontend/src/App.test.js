import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// ✅ Polyfill for older JSDOM env (fixes: "MutationObserver is not a constructor")
beforeAll(() => {
  if (typeof global.MutationObserver === 'undefined') {
    global.MutationObserver = class {
      disconnect() {}
      observe() {}
      takeRecords() { return []; }
    };
  }
});

beforeEach(() => {
  // ✅ needed for Spinner.jsx portal (document.getElementById('modal-root'))
  const modalRoot = document.createElement('div');
  modalRoot.setAttribute('id', 'modal-root');
  document.body.appendChild(modalRoot);

  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();

  const modalRoot = document.getElementById('modal-root');
  if (modalRoot) modalRoot.remove();
});

test('calls transactions endpoint on load', () => {
  global.fetch.mockResolvedValueOnce({
    json: async () => [{ peaktype: 'OFFPEAK', sourceid: 123 }],
  });

  render(<App />);

  expect(global.fetch).toHaveBeenCalledWith('/PS/api/ftr/transactions');
});

test('renders data after fetch resolves', async () => {
  global.fetch.mockResolvedValueOnce({
    json: async () => [{ peaktype: 'OFFPEAK', sourceid: 123 }],
  });

  render(<App />);

  expect(await screen.findByText(/OFFPEAK/i)).toBeInTheDocument();
});

