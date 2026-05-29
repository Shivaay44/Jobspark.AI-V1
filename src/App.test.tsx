/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import App from './App';
import { test, expect } from 'vitest';
import './test/setup'; // Import setup directly or keep in config if possible

test('renders app title', () => {
  render(<App />);

  expect(
    screen.getByRole('heading', { name: /Jobspark.AI/i })
  ).toBeInTheDocument();
});
