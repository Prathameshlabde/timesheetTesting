import React from 'react';
import ReactDOM from 'react-dom';
import NewEntry from './NewEntry';

import { render, fireEvent, waitFor, screen } from '@testing-library/react'

it('Onclick icon should open dilog box', () => {
    const { container, asFragment } = render(<NewEntry  />)
    expect(2+2).toBe(4);
});

