"use client";

import { forwardRef, useId, useState, type KeyboardEvent, type MouseEvent } from "react";
import styles from "./Switch.module.css";
import type { SwitchProps } from "./Switch.types";

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked: controlledChecked,
    defaultChecked = false,
    onCheckedChange,
    disabled = false,
    label,
    id,
    className = "",
    "data-testid": testId = "switch",
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const switchId = id || generatedId;
  const labelId = `${switchId}-label`;

  const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : uncontrolledChecked;

  const toggle = () => {
    if (disabled) return;
    const nextChecked = !isChecked;
    if (!isControlled) {
      setUncontrolledChecked(nextChecked);
    }
    onCheckedChange?.(nextChecked);
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toggle();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle();
    }
  };

  const computedAriaLabelledBy = ariaLabelledBy || (label ? labelId : undefined);

  return (
    <div className={styles.container}>
      <button
        ref={ref}
        type="button"
        role="switch"
        id={switchId}
        aria-checked={isChecked}
        aria-label={ariaLabel}
        aria-labelledby={computedAriaLabelledBy}
        disabled={disabled}
        data-testid={testId}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`${styles.switch} ${isChecked ? styles.switchChecked : ""} ${className}`.trim()}
        {...props}
      >
        <span
          data-testid={`${testId}-thumb`}
          className={`${styles.thumb} ${isChecked ? styles.thumbChecked : ""}`.trim()}
          aria-hidden="true"
        />
      </button>

      {label && (
        <label
          id={labelId}
          htmlFor={switchId}
          className={`${styles.label} ${disabled ? styles.labelDisabled : ""}`.trim()}
          data-testid={`${testId}-label`}
        >
          {label}
        </label>
      )}
    </div>
  );
});
