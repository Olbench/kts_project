import React from 'react';
import './Input.css';
import '../variables.css';

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'value'
> & {
  /** Значение поля */
  value?: string;
  /** Callback, вызываемый при вводе данных в поле */
  onChange: (value: string) => void;
  /** Слот для иконки справа */
  afterSlot?: React.ReactNode;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      value,
      onChange,
      afterSlot,
      type = 'text',
      className = '',
      disabled,
      placeholder,
      ...rest
    },
    ref
  ) => {
    const wrapperClassNames = [
      'input-wrapper',
      className,
      disabled ? 'input-disabled' : '',
      value ? 'input-not-empty' : 'input-empty',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={wrapperClassNames}>
        <input
          {...rest}
          ref={ref}
          type={type}
          value={value || ''}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="input-element"
          disabled={disabled}
        />
        {afterSlot && <div className="input-after-slot">{afterSlot}</div>}
      </div>
    );
  }
);

export default Input;
