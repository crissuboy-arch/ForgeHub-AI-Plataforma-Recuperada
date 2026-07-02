// src/components/molecules/FormField.tsx
import React from 'react';
import { Input } from '../atoms/Input';
import { Typography } from '../atoms/Typography';

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
}

/**
 * Campo de formulário: rótulo + Input + mensagem de erro opcional.
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  containerClassName,
  id,
  ...inputProps
}) => {
  return (
    <div className={containerClassName}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-content">
        {label}
      </label>
      <Input id={id} invalid={!!error} {...inputProps} />
      {error && (
        <Typography variant="caption" className="mt-1 block text-danger">
          {error}
        </Typography>
      )}
    </div>
  );
};
