// @ts-check
import tseslint from 'typescript-eslint';
import eslintConfig from '../../packages/config/eslint';

export default tseslint.config(
  ...eslintConfig
);