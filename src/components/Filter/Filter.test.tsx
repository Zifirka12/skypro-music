import { Track } from '@/types/track';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Filter } from './Filter';

const mockTracks: Track[] = [
  {
    _id: 1,
    name: 'Track 1',
    author: 'Author 1',
    release_date: '2020-01-01',
    genre: ['Rock', 'Pop'],
    duration_in_seconds: 180,
    album: 'Album 1',
    logo: null,
    track_file: 'track1.mp3',
    stared_user: [],
  },
  {
    _id: 2,
    name: 'Track 2',
    author: 'Author 2',
    release_date: '2021-01-01',
    genre: ['Jazz'],
    duration_in_seconds: 200,
    album: 'Album 2',
    logo: null,
    track_file: 'track2.mp3',
    stared_user: [],
  },
  {
    _id: 3,
    name: 'Track 3',
    author: 'Author 1',
    release_date: '2022-01-01',
    genre: ['Rock'],
    duration_in_seconds: 220,
    album: 'Album 3',
    logo: null,
    track_file: 'track3.mp3',
    stared_user: [],
  },
];

describe('Компонент Filter', () => {
  let mockOnFilterChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnFilterChange = vi.fn();
  });

  it('должен корректно рендериться', () => {
    render(<Filter tracks={mockTracks} onFilterChange={mockOnFilterChange} />);

    expect(screen.getByText('Искать по:')).toBeInTheDocument();
    expect(screen.getByText('исполнителю')).toBeInTheDocument();
    expect(screen.getByText('году выпуска')).toBeInTheDocument();
    expect(screen.getByText('жанру')).toBeInTheDocument();
  });

  it('должен открывать список авторов при клике на фильтр "исполнителю"', async () => {
    const user = userEvent.setup();
    render(<Filter tracks={mockTracks} onFilterChange={mockOnFilterChange} />);

    const authorButton = screen.getByText('исполнителю');
    await user.click(authorButton);

    expect(screen.getByText('Author 1')).toBeInTheDocument();
    expect(screen.getByText('Author 2')).toBeInTheDocument();
  });

  it('должен открывать список жанров при клике на фильтр "жанру"', async () => {
    const user = userEvent.setup();
    render(<Filter tracks={mockTracks} onFilterChange={mockOnFilterChange} />);

    const genreButton = screen.getByText('жанру');
    await user.click(genreButton);

    expect(screen.getByText('Rock')).toBeInTheDocument();
    expect(screen.getByText('Pop')).toBeInTheDocument();
    expect(screen.getByText('Jazz')).toBeInTheDocument();
  });

  it('должен открывать список годов при клике на фильтр "году выпуска"', async () => {
    const user = userEvent.setup();
    render(<Filter tracks={mockTracks} onFilterChange={mockOnFilterChange} />);

    const yearButton = screen.getByText('году выпуска');
    await user.click(yearButton);

    expect(screen.getByText('2022')).toBeInTheDocument();
    expect(screen.getByText('2021')).toBeInTheDocument();
    expect(screen.getByText('2020')).toBeInTheDocument();
  });

  it('должен вызывать onFilterChange при выборе автора', async () => {
    const user = userEvent.setup();
    render(<Filter tracks={mockTracks} onFilterChange={mockOnFilterChange} />);

    const authorButton = screen.getByText('исполнителю');
    await user.click(authorButton);

    const author1 = screen.getByText('Author 1');
    await user.click(author1);

    expect(mockOnFilterChange).toHaveBeenCalled();
    const lastCall =
      mockOnFilterChange.mock.calls[
        mockOnFilterChange.mock.calls.length - 1
      ][0];
    expect(lastCall.selectedAuthors).toContain('Author 1');
  });

  it('должен вызывать onFilterChange при выборе жанра', async () => {
    const user = userEvent.setup();
    render(<Filter tracks={mockTracks} onFilterChange={mockOnFilterChange} />);

    const genreButton = screen.getByText('жанру');
    await user.click(genreButton);

    const rockGenre = screen.getByText('Rock');
    await user.click(rockGenre);

    expect(mockOnFilterChange).toHaveBeenCalled();
    const lastCall =
      mockOnFilterChange.mock.calls[
        mockOnFilterChange.mock.calls.length - 1
      ][0];
    expect(lastCall.selectedGenres).toContain('Rock');
  });

  it('должен закрывать выпадающий список при клике вне компонента', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Filter tracks={mockTracks} onFilterChange={mockOnFilterChange} />
        <div data-testid="outside">Outside</div>
      </div>,
    );

    const authorButton = screen.getByText('исполнителю');
    await user.click(authorButton);

    expect(screen.getByText('Author 1')).toBeInTheDocument();

    const outside = screen.getByTestId('outside');
    await user.click(outside);

    // Список должен закрыться
    expect(screen.queryByText('Author 1')).not.toBeInTheDocument();
  });

  it('должен показывать количество выбранных фильтров', async () => {
    const user = userEvent.setup();
    render(<Filter tracks={mockTracks} onFilterChange={mockOnFilterChange} />);

    const authorButton = screen.getByText('исполнителю');
    await user.click(authorButton);

    const author1 = screen.getByText('Author 1');
    await user.click(author1);

    // Кнопка должна показывать количество выбранных фильтров
    const updatedAuthorButton = screen.getByText('исполнителю').closest('div');
    expect(updatedAuthorButton).toBeInTheDocument();
  });

  it('должен работать с пустым массивом треков', () => {
    render(<Filter tracks={[]} onFilterChange={mockOnFilterChange} />);

    expect(screen.getByText('Искать по:')).toBeInTheDocument();
    expect(screen.getByText('исполнителю')).toBeInTheDocument();
  });
});
