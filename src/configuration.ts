import { join } from 'path';
import { headerCase } from 'change-case';
import { workspace } from 'vscode';
import { Rule } from 'graphql-schema-linter/lib/validator'


const GRAPHQL_SCHEMA_KEY = 'graphql-schema-linter';

const RULES = [
  "lint-directive",
  "enum-values-sorted-alphabetically",
  "enum-values-all-caps",
  "types-are-capitalized",
  "field-name-rules",
  "relay-connection-types-spec",
  "types-have-descriptions",
  "relay-page-info-spec",
];
export async function getLinters(): Promise<[string, Rule][]> {
  const linterNames = getConfiguration();

  const linters = await Promise.all(linterNames.map<Rule>(linterName => require(`graphql-schema-linter/lib/rules/${headerCase(linterName)}`)))

  return linters.map((fn, index) => [linterNames[index], fn]);
};

export function getConfiguration(): string[] {
  const rootPath = workspace.rootPath;

  if (!rootPath) {
    return RULES;
  } else {
    try {
      const packageJson = require(join(rootPath, 'package.json'));

      if (GRAPHQL_SCHEMA_KEY in packageJson) {
        return packageJson[GRAPHQL_SCHEMA_KEY] as string[];
      } else {
        return RULES;
      }

    } catch (e) {
      throw new Error(`can not find key on package.json for project. looking in ${rootPath}`);
    }
  }


};