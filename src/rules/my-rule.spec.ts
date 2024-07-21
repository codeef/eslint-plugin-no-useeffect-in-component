import { RuleTester } from "@typescript-eslint/rule-tester";

import { noUseEffectInComponent } from "./no-useeffect-in-component";

const ruleTester = new RuleTester({
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run(
  "eslint-plugin/no-useeffect-in-component",
  noUseEffectInComponent,
  {
    valid: [
      {
        // a code snippet that should pass the linter
        code: `const x = 5;`,
      },
      {
        code: `let y = 'abc123';`,
      },
    ],
    invalid: [
      {
        code: `var z = 'foo'`,
        errors: [
          {
            messageId: "issue:useeffect",
          },
        ],
      },
    ],
  }
);
