module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:promise/recommended",
        "plugin:unicorn/recommended",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["react", "@typescript-eslint", "promise", "unicorn"],
    rules: {
        "react/react-in-jsx-scope": 0,
        "unicorn/prefer-query-selector": 0,
        "unicorn/filename-case": 0,
        "unicorn/no-null": 1,
        "unicorn/no-array-callback-reference": 0,
        "@typescript-eslint/no-empty-function": 1,
        "promise/always-return": 1,
        "promise/catch-or-return": [
            1,
            {"allowFinally": true}
        ]
    },
};
