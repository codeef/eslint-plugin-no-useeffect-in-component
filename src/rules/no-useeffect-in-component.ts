import { RuleCreator } from "@typescript-eslint/utils/eslint-utils";
export { ESLintUtils } from "@typescript-eslint/utils";
import { TSESTree } from "@typescript-eslint/types";

const createRule = RuleCreator((name) => `https://example.com/rule/${name}`);

export const noUseEffectInComponent = createRule({
  name: "useeffect-rule",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Warns when React useEffect hook is used directly inside a React component",
    },
    messages: {
      "issue:useeffect":
        "Avoid using useEffect directly inside a React component.",
    },
    schema: [], // no options
  },
  defaultOptions: [],

  create(context) {
    let containsReactComponent = false;
    let useEffectCallExpression: TSESTree.CallExpression | null = null;

    function isReactComponent(node: TSESTree.Node): boolean {
      if (
        node.type !== "FunctionDeclaration" &&
        node.type !== "FunctionExpression" &&
        node.type !== "ArrowFunctionExpression"
      ) {
        return false;
      }

      const parent = node.parent;
      if (
        parent &&
        parent.type === "VariableDeclarator" &&
        parent.id.type === "Identifier" &&
        /^[A-Z]/.test(parent.id.name)
      ) {
        return true;
      }

      if (
        node.type === "FunctionDeclaration" &&
        node.id &&
        /^[A-Z]/.test(node.id.name)
      ) {
        return true;
      }

      return false;
    }

    return {
      CallExpression(node: TSESTree.CallExpression) {
        if (
          (node.callee.type === "Identifier" &&
            node.callee.name === "useEffect") ||
          (node.callee.type === "MemberExpression" &&
            node.callee.property.type === "Identifier" &&
            node.callee.property.name === "useEffect")
        ) {
          useEffectCallExpression = node;
        }
      },
      FunctionDeclaration(node: TSESTree.FunctionDeclaration) {
        if (isReactComponent(node)) {
          containsReactComponent = true;
        }
      },
      FunctionExpression(node: TSESTree.FunctionExpression) {
        if (isReactComponent(node)) {
          containsReactComponent = true;
        }
      },
      ArrowFunctionExpression(node: TSESTree.ArrowFunctionExpression) {
        if (isReactComponent(node)) {
          containsReactComponent = true;
        }
      },
      "Program:exit"() {
        if (containsReactComponent && useEffectCallExpression) {
          context.report({
            node: useEffectCallExpression,
            messageId: "issue:useeffect",
          });
        }
      },
    };
  },
});
