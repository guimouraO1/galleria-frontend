import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import {defineConfig} from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
    {
        files: ['**.{js,mjs,cjs,ts,mts,cts}'],
        plugins: {js},
        extends: ['js/recommended'],
        languageOptions: {globals: globals.node}
    },
    tseslint.configs.recommended,
    {
        plugins: {
            '@stylistic': stylistic
        },
        rules: {
            'camelcase': ['error'],
            'no-prototype-builtins': ['off'],
            '@typescript-eslint/no-magic-numbers': ['off'],
            '@typescript-eslint/no-unused-vars': ['error',
                {
                    vars: 'all',
                    args: 'none',
                    caughtErrors: 'none',
                    ignoreRestSiblings: true
                }
            ],
            '@stylistic/brace-style': ['error'],
            '@stylistic/comma-dangle': ['error', 'never'],
            '@stylistic/comma-spacing': ['error', {before: false, after: true}],
            '@stylistic/indent': ['error', 4],
            '@stylistic/max-len': ['error', {code: 180, tabWidth: 4}],
            '@stylistic/no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
            '@stylistic/no-multiple-empty-lines': ['error', {max: 1}],
            '@stylistic/no-trailing-spaces': 'error',
            '@stylistic/object-curly-spacing': ['error', 'never'],
            '@stylistic/quotes': ['error', 'single', {avoidEscape: true}],
            '@stylistic/semi': ['error', 'always'],
            '@stylistic/space-before-blocks': ['error']
        }
    }
]);
