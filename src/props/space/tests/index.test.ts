import { space } from '..';
import { createSystem } from '@/core/createSystem';

const system = createSystem();

const parser = system(space);

const themedParser = (config: { [x: string]: any }) =>
  parser({
    theme: {
      breakpoints: ['40em', '52em', '64em'],
      space: ['0px', '4px', '8px', '12px', '16px'],
    },
    ...config,
  });

test('returns style objects', () => {
  const styles = themedParser({
    m: '4px',
  });
  expect(styles).toEqual({ margin: '4px' });
});

test('returns 0 values', () => {
  const styles = parser({ theme: { breakpoints: [] }, m: 0 });
  expect(styles).toEqual({ margin: 0 });
});

test('returns negative pixel values', () => {
  const styles = themedParser({ m: -2 });
  expect(styles).toEqual({ margin: '-8px' });
});

test('returns negative em values', () => {
  const styles = themedParser({ m: '-16em' });
  expect(styles).toEqual({ margin: '-16em' });
});

test('returns negative theme values', () => {
  const styles = parser({
    theme: {
      breakpoints: [],
      space: [0, 4, 8],
    },
    m: -2,
  });
  expect(styles).toEqual({ margin: -8 });
});

test('returns positive theme values', () => {
  const styles = parser({
    theme: {
      breakpoints: [],
      space: [0, '1em', '2em'],
    },
    m: 2,
  });
  expect(styles).toEqual({ margin: '2em' });
});

test('returns responsive values', () => {
  const styles = themedParser({
    m: [0, 2, 3],
  });
  expect(styles).toEqual({
    margin: '0px',
    '@media screen and (min-width: 40em)': { margin: '8px' },
    '@media screen and (min-width: 52em)': { margin: '12px' },
  });
});

test('returns aliased values', () => {
  const styles = themedParser({
    px: 2,
  });
  expect(styles).toEqual({ paddingLeft: '8px', paddingRight: '8px' });
});

test('returns string values from theme', () => {
  const styles = parser({
    theme: {
      breakpoints: [],
      space: [0, '1em'],
    },
    padding: 1,
  });
  expect(styles).toEqual({ padding: '1em' });
});

test('returns negative string values from theme', () => {
  const styles = parser({
    theme: {
      breakpoints: [],
      space: [0, '1em'],
    },
    margin: -1,
  });
  expect(styles).toEqual({ margin: '-1em' });
});

test('returns values from theme object', () => {
  const styles = parser({
    theme: {
      breakpoints: [],
      space: { sm: 1 },
    },
    margin: 'sm',
  });
  expect(styles).toEqual({ margin: 1 });
});

test('pl prop sets paddingLeft', () => {
  const styles = themedParser({ pl: 2 });
  expect(styles).toEqual({ paddingLeft: '8px' });
});

test('pl prop sets paddingLeft 0', () => {
  const styles = themedParser({ pl: 0 });
  expect(styles).toEqual({ paddingLeft: '0px' });
});

test('px prop overrides pl prop', () => {
  const styles = themedParser({
    pl: 1,
    px: 2,
  });
  expect(styles).toEqual({ paddingLeft: '8px', paddingRight: '8px' });
});

test('py prop overrides pb prop', () => {
  const styles = themedParser({
    pb: 1,
    py: 2,
  });
  expect(styles).toEqual({ paddingTop: '8px', paddingBottom: '8px' });
});

test('mx prop overrides mr prop', () => {
  const styles = themedParser({
    mr: 1,
    mx: 2,
  });
  expect(styles).toEqual({ marginLeft: '8px', marginRight: '8px' });
});

test('my prop overrides mt prop', () => {
  const styles = themedParser({
    mt: 1,
    my: 2,
  });
  expect(styles).toEqual({ marginTop: '8px', marginBottom: '8px' });
});

test('margin overrides m prop', () => {
  const styles = themedParser({
    m: 1,
    margin: 2,
  });
  expect(styles).toEqual({ margin: '8px' });
});

test('handles margin with no theme', () => {
  const styles = themedParser({
    mt: 12,
  });
  expect(styles).toEqual({
    marginTop: 12,
  });
});

test('handles overriding margin/padding shortcut props', () => {
  const styles = themedParser({
    m: 4,
    mx: 3,
    mr: 2,
    p: 4,
    py: 3,
    pt: 2,
  });
  expect(styles).toEqual({
    margin: '16px',
    marginLeft: '12px',
    marginRight: '8px',
    padding: '16px',
    paddingBottom: '12px',
    paddingTop: '8px',
  });
});

test('single directions override axes', () => {
  const styles = themedParser({
    mx: 3,
    ml: 1,
    mr: 2,
    px: 3,
    pl: 1,
    pr: 2,
  });
  expect(styles).toEqual({
    marginLeft: '4px',
    marginRight: '8px',
    paddingLeft: '4px',
    paddingRight: '8px',
  });
});

test('supports object values', () => {
  const styles = themedParser({
    m: {
      _: 0,
      0: 1,
      1: 2,
    },
  });
  expect(styles).toEqual({
    margin: '0px',
    '@media screen and (min-width: 40em)': {
      margin: '4px',
    },
    '@media screen and (min-width: 52em)': {
      margin: '8px',
    },
  });
});

test('supports non-array breakpoints', () => {
  const theme = {
    disableSystemPropsCache: true,
    space: ['0px', '4px', '8px', '12px', '16px'],
    breakpoints: {
      small: '40em',
      medium: '52em',
    },
  };
  const styles = parser({
    theme,
    p: {
      small: 2,
    },
    m: {
      _: 0,
      small: 1,
      medium: 2,
    },
  });
  expect(styles).toEqual({
    margin: '0px',
    '@media screen and (min-width: 40em)': {
      margin: '4px',
      padding: '8px',
    },
    '@media screen and (min-width: 52em)': {
      margin: '8px',
    },
  });
});
