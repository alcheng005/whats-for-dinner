import React from 'react';
import { getByLabelText, render } from '@testing-library/react';

import Home from '../client/components/Home.jsx';

describe('Home component unit tests', () => {
  it('Renders the title, a create room button, and a form with a room code input and a join room input', () => {
    const { getByText, getByRole, getByTestId } = render(<Home />);

    getByText('What\'s For Dinner');
    getByRole('button', { name: /^create room$/i, exact: false });
    getByTestId('roomCode');
    getByTestId('joinButton');
  });
});
