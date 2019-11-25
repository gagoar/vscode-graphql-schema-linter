import { join } from 'path';
import { snakeCase, pascalCase } from 'change-case';
import { workspace } from 'vscode';
import { Rule } from 'graphql-schema-linter/lib/validator'


const GRAPHQL_SCHEMA_KEY = 'graphql-schema-linter';

const RULES = [
  "enum-values-sorted-alphabetically",
  "enum-values-all-caps",
  "types-are-capitalized",
  "relay-connection-types-spec",
  "types-have-descriptions",
];
export async function getLinters(): Promise<[string, Rule][]> {
  const linterNames = getConfiguration();

  const linters = await Promise.all(linterNames.map<Record<string, Rule>>(linterName => require(`graphql-schema-linter/lib/rules/${snakeCase(linterName)}`)))

  return linters.map((fn, index) => [linterNames[index], fn[pascalCase(linterNames[index])]]);
};

export function getConfiguration(): string[] {
  const workspaceFolders = workspace.workspaceFolders;

  if (!workspaceFolders) {
    return RULES;
  } else {
    try {
      const { uri } = workspaceFolders[0]
      const packageJson = require(join(uri.path, 'package.json'));

      if (GRAPHQL_SCHEMA_KEY in packageJson) {
        return packageJson[GRAPHQL_SCHEMA_KEY] as string[];
      } else {
        return RULES;
      }

    } catch (e) {
      throw new Error(`can not find key on package.json for project. looking in ${JSON.stringify({ workspaceFolders })}`);
    }
  }


};