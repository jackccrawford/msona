import React, { ReactElement } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { themes } from '../types/Theme';

// Custom render with default providers/context
function customRender(ui: ReactElement, options = {}) {
  return {
    user: userEvent.setup(),
    ...render(ui, {
      wrapper: ({ children }) => (
        <div className="light">{children}</div>
      ),
      ...options
    })
  };
}

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };