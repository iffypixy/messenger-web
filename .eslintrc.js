module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        sourceType: "module"
    },
    plugins: [
        "@typescript-eslint/eslint-plugin"
    ],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended"
    ],
    root: true,
    env: {
        browser: true
    },
    rules: {
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-empty-interface": "off",
        "react/prop-types": "off",
        "react/display-name": "off"
    },
    settings: {
        react: {
            version: "detect"
        }
    }
};
