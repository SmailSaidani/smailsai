import { render, screen } from '@testing-library/react';
import Video from './pages/VideoChat/Video';

test('renders learn react link', () => {
  render(<Video />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
