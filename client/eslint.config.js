import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
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
    },
  },
)
