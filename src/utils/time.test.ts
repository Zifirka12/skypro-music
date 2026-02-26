import { describe, expect, it } from 'vitest';
import { formatTime } from './time';

describe('Функция formatTime', () => {
  it('должна форматировать время в секундах в формат MM:SS', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(30)).toBe('0:30');
    expect(formatTime(60)).toBe('1:00');
    expect(formatTime(90)).toBe('1:30');
    expect(formatTime(125)).toBe('2:05');
    expect(formatTime(3661)).toBe('61:01'); // 1 час 1 минута 1 секунда
  });

  it('должна обрабатывать отрицательные числа', () => {
    expect(formatTime(-10)).toBe('0:00');
  });

  it('должна обрабатывать NaN', () => {
    expect(formatTime(NaN)).toBe('0:00');
  });

  it('должна округлять секунды вниз', () => {
    expect(formatTime(59.9)).toBe('0:59');
    expect(formatTime(60.9)).toBe('1:00');
  });

  it('должна корректно форматировать большие значения', () => {
    expect(formatTime(3599)).toBe('59:59'); // Максимум для MM:SS формата
    expect(formatTime(3600)).toBe('60:00');
    expect(formatTime(7200)).toBe('120:00'); // 2 часа
  });
});
