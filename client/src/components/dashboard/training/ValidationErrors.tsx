
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ValidationErrorsProps {
  errors: string[];
}

export const ValidationErrors = ({ errors }: ValidationErrorsProps) => {
  if (errors.length === 0) return null;

  return (
    <div className="bg-destructive/15 border border-destructive/20 rounded-md p-3">
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="h-4 w-4" />
        <span className="font-medium">Erros de validação:</span>
      </div>
      <ul className="mt-2 text-sm text-destructive">
        {errors.map((error, index) => (
          <li key={index} className="ml-4">• {error}</li>
        ))}
      </ul>
    </div>
  );
};
