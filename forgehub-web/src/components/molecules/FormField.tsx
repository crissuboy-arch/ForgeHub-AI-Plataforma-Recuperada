// src/components/molecules/FormField.tsx
import React from 'react';
import { Input } from '../atoms/Input';
import { Typography } from '../atoms/Typography';

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Optional class for the container */
  containerClassName?: string;
}

/**
 * Simple form field component that pairs a label with an input.
 * Uses the Input atom and Typography for styling.
 */
export const FormField: React.FC<FormFieldProps> = ({ label, containerClassName, ...inputProps }) => {
  return (
    <div className={containerClassName}>
      <Typography variant="small" className="block mb-1 text-gray-600">
        {label}
      </Typography>
      <Input {...inputProps} />
    </div>
  );
};
