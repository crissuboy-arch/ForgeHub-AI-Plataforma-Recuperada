// src/components/atoms/Spinner.tsx
import React from 'react';
import classNames from 'classnames';

type SpinnerProps = {
  size?: number; // size in pixels
  className?: string;
};

/** Indicador de carregamento. Herda a cor do texto (currentColor). */
export const Spinner: React.FC<SpinnerProps> = ({ size = 20, className }) => (
  <svg
    className={classNames('animate-spin', className)}
    style={{ width: size, height: size }}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    ></path>
  </svg>
);
