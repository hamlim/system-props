import { createSystem } from '../../core';
import position from '..';

const system = createSystem();

const parser = system(position);

test('returns position styles', () => {
  const style = parser({
    theme: {
      breakpoints: [],
    },
    position: 'absolute',
    top: 0,
    right: 0,
  });
  expect(style).toEqual({
    position: 'absolute',
    top: 0,
    right: 0,
  });
});

test('returns theme values', () => {
  const style = parser({
    theme: {
      breakpoints: [],
      space: [0, 4, 8, 16, 32],
    },
    top: 1,
    right: 2,
    bottom: 3,
    left: 4,
  });
  expect(style).toEqual({ top: 4, right: 8, bottom: 16, left: 32 });
});

test('returns pixel values', () => {
  const style = parser({
    theme: {
      breakpoints: [],
    },
    top: '1px',
    right: '2px',
    bottom: '3px',
    left: '4px',
  });
  expect(style).toEqual({
    top: '1px',
    right: '2px',
    bottom: '3px',
    left: '4px',
  });
});
