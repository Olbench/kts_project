import React, { useEffect, useRef, useState } from 'react';
import './MultiDropDown.css';
import Input from '../Input/Input';
import Text from '../Text/Text';
import '../variables.css';
import ArrowDownIcon from '../icons/ArrowDownIcon';

export type Option = {
  key: string;
  value: string;
};

export type MultiDropdownProps = {
  className?: string;
  options: Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  disabled?: boolean;
  getTitle: (value: Option[]) => string;
};

const MultiDropdown: React.FC<MultiDropdownProps> = ({
  className,
  options,
  value,
  onChange,
  disabled,
  getTitle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [currentInput, setCurrentInput] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);

  const handleInputChange = (inputValue: string) => {
    if (value.length) {
      return;
    }
    setCurrentInput(inputValue);
    const newFilteredOptions = options.filter((option) =>
      option.value.toLowerCase().startsWith(inputValue.toLowerCase())
    );
    setFilteredOptions(newFilteredOptions);
  };

  const handleOptionClick = (option: Option) => {
    const optionIndex = value.findIndex((item) => item.key === option.key);
    if (optionIndex !== -1) {
      onChange(
        value.slice(0, optionIndex).concat(value.slice(optionIndex + 1))
      );
      return;
    }
    onChange([...value, option]);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options, setFilteredOptions]);

  return (
    <div className={`multi-dropdown-container ${className}`} ref={dropdownRef}>
      <Input
        type="text"
        value={value.length ? getTitle(value) : currentInput}
        onClick={() => !disabled && setIsOpen(true)}
        onChange={handleInputChange}
        placeholder={getTitle(value)}
        disabled={disabled}
        afterSlot={<ArrowDownIcon color="secondary" />}
      />

      {isOpen && !disabled && (
        <div className="multi-dropdown-options">
          {filteredOptions.map((option) => (
            <div
              key={option.key}
              className="multi-dropdown-option-wrapper"
              onClick={() => handleOptionClick(option)}
              data-testid={option.key}
            >
              <Text className="multi-dropdown-option-text">{option.value}</Text>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiDropdown;
