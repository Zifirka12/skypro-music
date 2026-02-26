import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Search } from './Search';

describe('Компонент Search', () => {
  it('должен корректно рендериться с placeholder', () => {
    const mockOnChange = vi.fn();
    render(<Search value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Поиск');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'search');
  });

  it('должен отображать переданное значение', () => {
    const mockOnChange = vi.fn();
    render(<Search value="test query" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Поиск');
    expect(input).toHaveValue('test query');
  });

  it('должен вызывать onChange при вводе текста', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(<Search value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Поиск');
    await user.type(input, 'test');

    expect(mockOnChange).toHaveBeenCalled();
    // userEvent.type вызывает onChange для каждой буквы отдельно
    expect(mockOnChange).toHaveBeenCalledWith('t');
    expect(mockOnChange).toHaveBeenCalledWith('e');
    expect(mockOnChange).toHaveBeenCalledWith('s');
    expect(mockOnChange).toHaveBeenCalledWith('t');
  });

  it('должен обновлять значение при изменении пропса value', () => {
    const mockOnChange = vi.fn();
    const { rerender } = render(<Search value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Поиск');
    expect(input).toHaveValue('');

    rerender(<Search value="новое значение" onChange={mockOnChange} />);
    expect(input).toHaveValue('новое значение');
  });
});
