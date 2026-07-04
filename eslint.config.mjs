import baseBestPracticesRules from "eslint-config-airbnb-base/rules/best-practices";
import baseErrorsRules from "eslint-config-airbnb-base/rules/errors";
import baseES6Rules from "eslint-config-airbnb-base/rules/es6";
import baseImportsRules from "eslint-config-airbnb-base/rules/imports";
import baseStyleRules from "eslint-config-airbnb-base/rules/style";
import baseVariablesRules from "eslint-config-airbnb-base/rules/variables";
import typescript_plugin from "@typescript-eslint/eslint-plugin";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginVue from "eslint-plugin-vue";
import stylistic from "@stylistic/eslint-plugin";
import globals from 'globals';

import parser from "@typescript-eslint/parser";

const eslintParser = {
    parse: (code, options) => {
        return parser.parse(code, {
            ...options,
            project: "./tsconfig.app.json",
        });
    },
    parseForESLint: (code, options) => {
        return parser.parseForESLint(code, {
            ...options,
            project: "./tsconfig.app.json",
        });
    },
};

import vueParser from "vue-eslint-parser";

import * as espree from "espree";

export default [
    {
        ignores: ["dist/**", "src/shared/ui/**", "src/vite-env.d.ts"],
    },
    ...eslintPluginVue.configs["flat/recommended"],

    {
        plugins: {
            "@typescript-eslint": typescript_plugin,
            "@stylistic": stylistic,
            import: eslintPluginImport,
        },
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                parser: {
                    js: espree,
                    ts: eslintParser,
                    "<template>": espree,
                },
                project: "./tsconfig.app.json",
                extraFileExtensions: [".vue"],
            },
            globals: {
                ...globals.browser,
            }
        },
        files: ["src/**/*.vue", "src/**/*.js", "src/**/*.ts", "./eslint.config.mjs"],
        ignores: ["dist/**/*", "src/shared/ui/**/*"],
        rules: {
            "array-callback-return": ["error", { checkForEach: false }],
            "constructor-super": "error",
            "for-direction": "error",
            "getter-return": "error",
            "no-async-promise-executor": "error",
            "no-await-in-loop": "error",
            "no-class-assign": "error",
            "no-compare-neg-zero": "error",
            "no-cond-assign": "error",
            "no-const-assign": "error",
            "no-constant-binary-expression": "error",
            "no-constant-condition": "error",
            "no-constructor-return": "error",
            "no-control-regex": "error",
            "no-debugger": "error",
            "no-dupe-args": "error",
            "no-dupe-class-members": "error",
            "no-dupe-else-if": "error",
            "no-dupe-keys": "error",
            "no-duplicate-case": "error",
            "no-duplicate-imports": "error",
            "no-empty-character-class": "error",
            "no-empty-pattern": "error",
            "no-ex-assign": "error",
            "no-fallthrough": "error",
            "no-func-assign": "error",
            "no-import-assign": "error",
            "no-inner-declarations": "error",
            "no-invalid-regexp": "error",
            "no-irregular-whitespace": "error",
            "no-misleading-character-class": "error",
            "no-new-native-nonconstructor": "error",
            "no-obj-calls": "error",
            "no-promise-executor-return": "error",
            "no-self-assign": "error",
            "no-self-compare": "error",
            "no-setter-return": "error",
            "no-sparse-arrays": "error",
            "no-template-curly-in-string": "error",
            "no-this-before-super": "error",
            "no-undef": "error",
            "no-unexpected-multiline": "error",
            "no-unmodified-loop-condition": "error",
            "no-unreachable": "warn",
            "no-unreachable-loop": "warn",
            "no-unsafe-finally": "error",
            "no-unsafe-negation": "error",
            "no-unsafe-optional-chaining": "error",
            "no-unused-private-class-members": "warn",
            "no-useless-backreference": "error",
            "require-atomic-updates": "error",
            "use-isnan": "error",
            "valid-typeof": "error",
            "arrow-body-style": ["error", "always"],
            "capitalized-comments": "error",
            complexity: "error",
            "consistent-this": "error",
            curly: "error",
            "default-case": "error",
            "default-case-last": "error",
            eqeqeq: "error",
            "grouped-accessor-pairs": "error",
            "guard-for-in": "error",
            "logical-assignment-operators": "error",
            "new-cap": "error",
            "no-alert": "error",
            "no-array-constructor": "error",
            "no-caller": "error",
            "no-console": "warn",
            "no-else-return": "error",
            "no-empty": "error",
            "no-empty-function": "error",
            "no-empty-static-block": "error",
            "no-eq-null": "error",
            "no-eval": "error",
            "no-extend-native": "error",
            "no-extra-bind": "error",
            "no-extra-boolean-cast": "error",
            "no-global-assign": "error",
            "no-implicit-globals": "error",
            "no-iterator": "error",
            "no-label-var": "error",
            "no-labels": "error",
            "no-lone-blocks": "error",
            "no-lonely-if": "error",
            "no-multi-assign": "error",
            "no-multi-str": "error",
            "no-nested-ternary": "error",
            "no-new": "error",
            "no-new-func": "error",
            "no-new-wrappers": "error",
            "no-nonoctal-decimal-escape": "error",
            "no-object-constructor": "error",
            "no-octal": "error",
            "no-octal-escape": "error",
            "no-proto": "error",
            "no-regex-spaces": "error",
            "no-script-url": "error",
            "no-sequences": "error",
            "no-shadow-restricted-names": "error",
            "no-undef-init": "error",
            "no-undefined": "error",
            "no-underscore-dangle": "error",
            "no-unneeded-ternary": "error",
            "no-useless-call": "error",
            "no-useless-catch": "error",
            "no-useless-escape": "error",
            "no-useless-rename": "error",
            "no-useless-return": "error",
            "no-var": "error",
            "no-void": "error",
            "no-with": "error",
            "prefer-arrow-callback": "error",
            "prefer-const": "warn",
            "prefer-exponentiation-operator": "error",
            "prefer-named-capture-group": "error",
            "prefer-object-has-own": "error",
            "prefer-regex-literals": "error",
            "prefer-rest-params": "error",
            "prefer-spread": "error",
            "prefer-template": "error",
            "require-yield": "error",
            "max-depth": ["error", 3],
            "max-nested-callbacks": "error",
            "no-negated-condition": "error",
            "no-param-reassign": "error",
            "no-warning-comments": "warn",
            "@typescript-eslint/adjacent-overload-signatures": "error",
            "@typescript-eslint/array-type": "error",
            "@typescript-eslint/ban-ts-comment": [
                "error",
                {
                    "ts-expect-error": "allow-with-description",
                    "ts-ignore": "allow-with-description",
                    "ts-nocheck": "allow-with-description",
                },
            ],
            "comma-dangle": "off",
            "@stylistic/comma-dangle": ["error", "always-multiline"],
            "comma-spacing": "off",
            "@stylistic/comma-spacing": "error",
            "@typescript-eslint/consistent-generic-constructors": "error",
            "@typescript-eslint/consistent-indexed-object-style": ["error", "index-signature"],
            "@typescript-eslint/consistent-type-definitions": "error",
            "default-param-last": "off",
            "@typescript-eslint/default-param-last": "error",
            "@typescript-eslint/explicit-function-return-type": "error",
            "@typescript-eslint/explicit-member-accessibility": "error",
            "@typescript-eslint/explicit-module-boundary-types": "error",
            "@typescript-eslint/no-array-constructor": "error",
            "@typescript-eslint/no-confusing-non-null-assertion": "error",
            "@typescript-eslint/no-extra-non-null-assertion": "error",
            "@stylistic/no-extra-parens": "error",
            "@stylistic/no-extra-semi": "error",
            "@typescript-eslint/no-extraneous-class": "error",
            "@typescript-eslint/no-for-in-array": "error",
            "@typescript-eslint/no-inferrable-types": "error",
            "no-invalid-this": "off",
            "@typescript-eslint/no-invalid-this": "error",
            "no-loop-func": "off",
            "@typescript-eslint/no-invalid-void-type": "error",
            "@typescript-eslint/no-loop-func": "error",
            "@typescript-eslint/no-misused-new": "error",
            "@typescript-eslint/no-namespace": "error",
            "no-redeclare": "off",
            "@typescript-eslint/no-redeclare": "error",
            "@typescript-eslint/no-require-imports": "error",
            "no-shadow": "off",
            "@typescript-eslint/no-shadow": "error",
            "@typescript-eslint/no-unnecessary-parameter-property-assignment": "error",
            "@typescript-eslint/no-unnecessary-type-constraint": "error",
            "@typescript-eslint/no-unsafe-declaration-merging": "error",
            "no-unused-expressions": "off",
            "@typescript-eslint/no-unused-expressions": "warn",
            "@typescript-eslint/no-unused-vars": "error",
            "no-unused-vars": "off",
            "no-use-before-define": "off",
            "@typescript-eslint/no-use-before-define": "error",
            "no-useless-constructor": "off",
            "@typescript-eslint/no-useless-constructor": "error",
            "@typescript-eslint/no-useless-empty-export": "error",
            "@typescript-eslint/no-var-requires": "error",
            "@typescript-eslint/no-wrapper-object-types": "error",
            "@typescript-eslint/prefer-as-const": "error",
            "@typescript-eslint/prefer-for-of": "error",
            "@typescript-eslint/require-await": "error",
            "@typescript-eslint/no-explicit-any": "error",
            "@stylistic/object-curly-spacing": ["error", "always"],
            "@stylistic/indent": ["error", 2],
            "@stylistic/member-delimiter-style": "error",
            "func-call-spacing": "error",

            // Append 'ts' and 'tsx' to Airbnb 'import/extensions' rule
            // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/extensions.md
            "import/extensions": [
                "error",
                "never",
                {
                    ignorepackages: true,
                    vue: "always",
                    js: "always",
                    css: "always",
                },
            ],

            // Append 'ts' and 'tsx' extensions to Airbnb 'import/no-extraneous-dependencies' rule
            // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
            "import/no-extraneous-dependencies": [
                baseImportsRules.rules["import/no-extraneous-dependencies"][0],
                {
                    ...baseImportsRules.rules["import/no-extraneous-dependencies"][1],
                    devDependencies: baseImportsRules.rules[
                        "import/no-extraneous-dependencies"
                    ][1].devDependencies.reduce((result, devDep) => {
                        const toAppend = [devDep];
                        const devDepWithTs = devDep.replace(/\bjs(x?)\b/g, "ts$1");
                        if (devDepWithTs !== devDep) {
                            toAppend.push(devDepWithTs);
                        }
                        return [...result, ...toAppend];
                    }, []),
                },
            ],
            "require-atomic-updates": "off",
            "vue/no-v-html": "off",
        },
    },
];
