import * as React from 'react';
import Icon from '../Icon';
import type { IconProps } from '../Icon';

const CheckIcon: React.FC<IconProps> = ({
  width = 24,
  height = 24,
  color,
  ...props
}) => {
  return (
    <Icon
      width={width}
      height={height}
      viewBox="0 0 24 24"
      color={color}
      {...props}
    >
      <path d={'M4 11.6129L9.87755 18L20 7'} fill="none" strokeWidth="2" />
    </Icon>
  );
};

export default CheckIcon;
