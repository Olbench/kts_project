import React from 'react';
import classNames from 'classnames';
import './Button.css';
import Text from '../Text';
import Loader from '../Loader';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  loading = false,
  disabled = false,
  children,
  onClick,
  className,
  ...props
}) => {
  const buttonClass = classNames('button', className, {
    'button-loading': loading,
    'button-disabled': disabled,
  });

  return (
    <button onClick={onClick} className={buttonClass} disabled={loading || disabled} {...props}>
      {loading && <Loader size="s" color="#FFFFFF" />}
      <Text tag="div" view="button">
        {children}
      </Text>
    </button>
  );
};

export default Button;
