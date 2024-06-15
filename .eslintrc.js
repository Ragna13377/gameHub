module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ['react', '@typescript-eslint', 'prettier'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    warnOnUnsupportedTypeScriptVersion: false,
	  ecmaFeatures: {
		  jsx: true
	  }
  },
  settings: {
    react: {
      version: "detect",
    },
	  "import/resolver": {
			typescript: {
				"project": "tsconfig.json"
			}
	  }
  },
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:jsx-a11y/recommended",
    "plugin:eslint-comments/recommended",
  ],
  rules: {
	  "prettier/prettier": [
		  "warn",
		  {
			  "usePrettierrc": true
		  }
	  ],
	  'no-unused-vars': 'off',
	  '@typescript-eslint/no-unused-vars': ['warn'],
	  "react/react-in-jsx-scope": "off",
	  "react/void-dom-elements-no-children": "warn",
	  "react/no-unsafe": "warn",
	  "react/self-closing-comp": "warn",
	  "react/jsx-boolean-value": ["warn", "never"],
	  "react/jsx-key": "warn",
	  "react/jsx-max-props-per-line": ["warn", { "maximum": 7 }],
	  "react/jsx-max-depth": ["warn", { "max": 8 }],
	  "arrow-body-style": ["warn", "as-needed"],
	  "jsx-quotes": ["warn", "prefer-single"],
	  "valid-typeof": "warn",
	  "@typescript-eslint/member-ordering": [
		  "warn",
		  {
			  "default": [
				  "private-static-field",
				  "protected-static-field",
				  "public-static-field",
				  "private-static-method",
				  "protected-static-method",
				  "public-static-method",
				  "private-constructor",
				  "protected-constructor",
				  "public-constructor",
				  "private-instance-field",
				  "protected-instance-field",
				  "public-instance-field",
				  "private-instance-method",
				  "protected-instance-method",
				  "public-instance-method"
			  ]
		  }
	  ],
    quotes: [2, "single", { avoidEscape: true }],
  },
};