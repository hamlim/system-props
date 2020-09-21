import { betterGet } from './get';
import { Props, PropertyConfig, SystemConfig } from './types';

const getValue = (value: unknown, scale: {}, props: Props) =>
  betterGet(scale || props.theme, value);

export const createStyleFunction = ({
  properties,
  property,
  scale,
  transform = getValue,
  defaultScale,
}: PropertyConfig): SystemConfig => {
  const _properties = properties || [property];

  const systemConfig: SystemConfig = (
    value: unknown,
    scale: string,
    props: Props
  ) => {
    const result = {};
    const n = transform(value, scale, props);
    if (n === null) {
      return result;
    }
    _properties.forEach(prop => {
      // @ts-ignore
      result[prop] = n;
    });
    return result;
  };

  Object.assign(systemConfig, { scale, defaultScale });
  return systemConfig;
};
