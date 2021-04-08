import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

import Home from '../client/components/Home.jsx';

describe('Home component unit tests', () => {
  it('Renders the title, a create room button, and a form with a room code input and a join room input', () => {
    const { getByText, getByRole, getByTestId } = render(<Home />);

    getByText('What\'s For Dinner');
    getByRole('button', { name: /^create room$/i, exact: false });
    getByTestId('roomCode');
    getByTestId('joinButton');
  });

  it('Invalid room code reveals a "Room code is invalid" message', () => {
    const { getByTestId, getByText } = render(<Home />);

    userEvent.type(getByTestId('roomCode'), 'AA');
    userEvent.click(getByTestId('joinButton'))
    getByText('Room code is invalid');
  });

  // need to look into mocking
  // xit('Room with a code that doesn\'t exist reveals a "Room not found" message', () => {
  //   const { getByTestId, getByText } = render(<Home />);

  //   userEvent.type(getByTestId('roomCode'), 'BBBB');
  //   userEvent.click(getByTestId('joinButton'))
  //   getByText('Room not found');
  // });
});
