import React from 'react';
import classNames from 'classnames';
import './Button.css';
import Text from '../Text';
import Loader from '../Loader';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Состояние загрузки */
  loading?: boolean;
  disabled?: boolean;
  /** Текст кнопки */
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
};

const Button: React.FC<ButtonProps> = ({
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

  const buttonText = (
    <Text tag="div" view="button">
      {children}
    </Text>
  );

  return (
    <button onClick={onClick} className={buttonClass} disabled={loading || disabled} {...props}>
      {loading ? (
        <>
          <Loader size="s" color="#FFFFFF" />
          {buttonText}
        </>
      ) : (
        buttonText
      )}
    </button>
  );
};

export default Button;
