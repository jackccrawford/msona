import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '../test/utils';
import { QuoteCard } from '../QuoteCard';
import { themes } from '../../types/Theme';

describe('QuoteCard', () => {
  const mockQuote = {
    id: '1',
    title: 'Wisdom',
    content: 'Test quote content',
    author: 'Test Author'
  };

  const defaultProps = {
    quote: mockQuote,
    isLiked: false,
    onToggleLike: vi.fn(),
    selectedVoice: 'test-voice',
    theme: themes[0],
    isDark: false
  };

  it('renders quote content correctly', () => {
    render(<QuoteCard {...defaultProps} />);
    
    expect(screen.getByText(mockQuote.content)).toBeInTheDocument();
    expect(screen.getByText(`— ${mockQuote.author}`)).toBeInTheDocument();
    expect(screen.getByText(mockQuote.title)).toBeInTheDocument();
  });

  it('handles like toggle', async () => {
    const onToggleLike = vi.fn();
    const { user } = render(
      <QuoteCard {...defaultProps} onToggleLike={onToggleLike} />
    );

    const likeButton = screen.getByLabelText(/add to favorites/i);
    await user.click(likeButton);

    expect(onToggleLike).toHaveBeenCalledWith(mockQuote.id);
  });

  it('expands and shows transformation UI', async () => {
    const { user } = render(<QuoteCard {...defaultProps} />);

    const transformButton = screen.getByText('Transform');
    await user.click(transformButton);

    expect(screen.getByPlaceholderText(/enter your transformation/i)).toBeInTheDocument();
  });

  it('shows copy confirmation when sharing', async () => {
    const { user } = render(<QuoteCard {...defaultProps} />);
    
    // Mock clipboard API
    const mockClipboard = {
      writeText: vi.fn().mockImplementation(() => Promise.resolve())
    };
    Object.assign(navigator, { clipboard: mockClipboard });

    const shareButton = screen.getByLabelText(/share quote/i);
    await user.click(shareButton);

    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });
});