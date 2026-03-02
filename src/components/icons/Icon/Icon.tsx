// components/icons/Icon.tsx
import * as React from 'react';
import '../../variables.css';

export type IconProps = React.SVGAttributes<SVGElement> & {
  className?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'disabled';
  width?: number;
  height?: number;
};

const Icon: React.FC<React.PropsWithChildren<IconProps>> = ({
  className = '',
  color,
  width = 24,
  height = 24,
  stroke,
  ...props
}) => {
  const getColor = (
    color?: 'primary' | 'secondary' | 'accent' | 'disabled'
  ) => {
    switch (color) {
      case 'primary':
        return 'var(--text-primary)';
      case 'secondary':
        return 'var(--text-secondary)';
      case 'accent':
        return 'var(--text-accent)';
      case 'disabled':
        return '#00000033';
      default:
        return 'currentColor';
    }
  };

  return (
    <svg
      className={className}
      width={width}
      height={height}
      fill={getColor(color)}
      stroke={stroke === 'none' ? 'none' : getColor(color)}
      {...props}
    ></svg>
  );
};

export default Icon;
