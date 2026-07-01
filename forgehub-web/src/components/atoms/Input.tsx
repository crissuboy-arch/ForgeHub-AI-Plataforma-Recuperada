// src/components/atoms/Input.tsx
import React from 'react';
import classNames from 'classnames';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

export const Input: React.FC<InputProps> = ({ className, ...rest }) => {
  const base = 'w-full px-3 py-2 border rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500';
  return <input className={classNames(base, className)} {...rest} />;
};
