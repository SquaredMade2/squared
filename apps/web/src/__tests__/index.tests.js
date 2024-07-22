import React from 'react';
import { render } from '@testing-library/react';
import { store } from '../store/index';
import { Provider } from 'react-redux';
import Home from '../app/workspace/[workspace]/page';

describe('mainPage', () => {
  it('should render', () => {
    render(<Home />, { wrapper: ({ children }) => <Provider store={store}>{children}</Provider> });
  });
});
