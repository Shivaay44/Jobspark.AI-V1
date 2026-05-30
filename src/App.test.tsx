/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import App from './App';
import { test, expect } from 'vitest';
import './test/setup'; // Import setup directly or keep in config if possible
import { FirebaseProvider } from './components/FirebaseProvider';

test('renders app title', () => {
  render(
    <FirebaseProvider>
      <App />
    </FirebaseProvider>
  );

  expect(
    screen.getByRole('heading', { name: /Jobspark.AI/i })
  ).toBeInTheDocument();
});
