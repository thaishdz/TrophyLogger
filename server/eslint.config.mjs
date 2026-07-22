// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    'rules': {
      'semi': [
        'error',
        'never'
      ], // Enforce no semicolons
      'quotes': [
        'error',
        'single'
      ], // Enforce single quotes
      'indent': [
        'error',
        2,
        {
          'SwitchCase': 1
        }
      ], // Enforce 2 spaces indentation
      'eol-last': [
        'error',
        'always'
      ], // Enforce newline at the end of file
    }
  }
);
