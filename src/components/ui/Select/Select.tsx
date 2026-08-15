"use client";

import { Check, ChevronDown } from "lucide-react";
import { forwardRef, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import styles from "./Select.module.css";
import type { SelectOption, SelectProps } from "./Select.types";

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    id,
    label,
    options = [],
    value,
    defaultValue,
    onChange,
    disabled,
    error,
    helperText,
    fullWidth = false,
    className = "",
    "data-testid": testId = "select",
    name,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const listboxId = `${selectId}-listbox`;
  const errorId = `${selectId}-error`;
  const helperId = `${selectId}-helper`;

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const internalSelectRef = useRef<HTMLSelectElement | null>(null);

  const [currentValue, setCurrentValue] = useState<string>(
    ((value !== undefined
      ? value
      : defaultValue !== undefined
        ? defaultValue
        : options[0]?.value) as string) || ""
  );

  useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(String(value));
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => String(opt.value) === String(currentValue));
  const displayText = selectedOption ? selectedOption.label : currentValue || "Selecione...";

  function handleSelectOption(option: SelectOption) {
    if (option.disabled || disabled) return;

    setCurrentValue(option.value);
    setIsOpen(false);

    if (internalSelectRef.current) {
      internalSelectRef.current.value = option.value;
    }

    if (onChange) {
      const syntheticEvent = {
        target: { value: option.value, name },
        currentTarget: { value: option.value, name },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;

    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  const ariaDescribedBy = error ? errorId : helperText ? helperId : undefined;

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${fullWidth ? styles.fullWidth : ""} ${className}`.trim()}
      data-testid={`${testId}-container`}
    >
      {label && (
        <label
          id={`${selectId}-label`}
          htmlFor={selectId}
          className={styles.label}
          data-testid={`${testId}-label`}
        >
          {label}
        </label>
      )}

      <div className={styles.selectWrapper}>
        {/* Custom Dropdown Trigger Button */}
        <button
          type="button"
          id={selectId}
          disabled={disabled}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-labelledby={label ? `${selectId}-label ${selectId}` : selectId}
          aria-invalid={Boolean(error)}
          aria-describedby={ariaDescribedBy}
          className={`${styles.triggerButton} ${isOpen ? styles.triggerOpen : ""} ${
            error ? styles.triggerError : ""
          }`.trim()}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
        >
          <span className={styles.selectedText}>{displayText}</span>
          <ChevronDown
            size={16}
            className={`${styles.chevronIcon} ${isOpen ? styles.chevronOpen : ""}`.trim()}
            aria-hidden="true"
          />
        </button>

        {/* Floating Dropdown Menu */}
        {isOpen && (
          <ul
            id={listboxId}
            role="listbox"
            aria-labelledby={`${selectId}-label`}
            className={styles.dropdownMenu}
            data-testid={`${testId}-dropdown`}
          >
            {options.map((opt) => {
              const isSelected = String(opt.value) === String(currentValue);
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={opt.disabled}
                  className={`${styles.optionItem} ${
                    isSelected ? styles.optionSelected : ""
                  } ${opt.disabled ? styles.optionDisabled : ""}`.trim()}
                  onClick={() => handleSelectOption(opt)}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <Check size={16} className={styles.checkIcon} aria-hidden="true" />
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Hidden Native Select for Forms and Integration */}
        <select
          ref={(element) => {
            internalSelectRef.current = element;
            if (typeof ref === "function") {
              ref(element);
            } else if (ref) {
              ref.current = element;
            }
          }}
          name={name}
          value={currentValue}
          onChange={(e) => {
            setCurrentValue(e.target.value);
            onChange?.(e);
          }}
          disabled={disabled}
          data-testid={testId}
          tabIndex={-1}
          aria-hidden="true"
          className={styles.nativeSelectHidden}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <span
          id={errorId}
          className={styles.errorMessage}
          role="alert"
          data-testid={`${testId}-error`}
        >
          {error}
        </span>
      )}

      {!error && helperText && (
        <span id={helperId} className={styles.helperText} data-testid={`${testId}-helper`}>
          {helperText}
        </span>
      )}
    </div>
  );
});
