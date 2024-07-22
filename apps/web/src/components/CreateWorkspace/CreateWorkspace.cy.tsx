import React from 'react';
import { mount } from 'cypress/react18';
import CreateWorkspace from '.';

// Mock functions
const mockOnboarding = true;
const mockHandleNextPage = cy.stub();

describe('<CreateWorkspace />', () => {
  it('renders', () => {
    mount(<CreateWorkspace onboarding={mockOnboarding} handleNextPage={mockHandleNextPage} />);
  });
});
