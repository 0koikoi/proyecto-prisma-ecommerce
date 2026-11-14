import { useId } from 'react';

export function Input({
  label,
  error,
  icon: Icon,
  id,
  className = '',
  wrapperClassName = '',
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className={`input-field-group ${className}`.trim()}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <div
        className={`input-wrapper-ice ${
          error ? 'border-rose focus-within:border-rose' : ''
        } ${wrapperClassName}`.trim()}
      >
        {Icon && <Icon className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />}
        <input id={inputId} className="input-element" {...props} />
      </div>
      {error && (
        <span className="text-xs text-rose font-medium" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
