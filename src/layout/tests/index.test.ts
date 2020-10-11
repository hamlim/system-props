import { createSystem } from '../../core';
import size from '..';

const system = createSystem();

const parser = system(size);

test('returns layout styles', () => {
  const style = parser({
    theme: {
      breakpoints: ['40em', '52em'],
    },
    width: [1, 1 / 2, 1 / 4],
    minHeight: 32,
    maxWidth: 768,
  });
  expect(style).toEqual({
    width: '100%',
    maxWidth: 768,
    minHeight: 32,
    '@media screen and (min-width: 40em)': {
      width: '50%',
    },
    '@media screen and (min-width: 52em)': {
      width: '25%',
    },
  });
});

test('returns 0 from theme.sizes', () => {
  const style = parser({
    theme: {
      breakpoints: [],
      sizes: [24, 48, 96],
    },
    width: 0,
    height: 0,
  });
  expect(style).toEqual({
    width: 24,
    height: 24,
  });
});
