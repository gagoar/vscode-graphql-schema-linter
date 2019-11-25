import { GraphQLError, ValidationContext, Visitor, ASTKindToNode } from 'graphql';
import { Rule, ValidationError } from 'graphql-schema-linter/lib/validator'
import { validateSchemaDefinition } from 'graphql-schema-linter/lib/validator';
import { Configuration } from 'graphql-schema-linter/lib/configuration';
import { TextEditor, Range, DecorationOptions } from 'vscode';

export type NamedLinter = [string, Rule];
type LintContent = { linters: NamedLinter[], content: string, activeEditor: TextEditor };
/**
 * For the AST parser to work correctly we need always the default Query in the fragment. 
 */

const defaultQuery = `"Query root" type Query { "Field" a: String }`;
const addedLength = defaultQuery.length;

export function lintContent({ linters, content, activeEditor }: LintContent): DecorationOptions[] {
  const schemaString = `${defaultQuery}${content}`;
  const linterFns = linters.map(([, linter]) => linter);
  const configuration = new Configuration({}, null);
  const errors = validateSchemaDefinition(schemaString, linterFns, configuration);
  const decorationOptions = errors.map((error) => {
    // we add more characters with the defaultQuery so we should subtract it every time we try to find out string locations. 
    const start = error.nodes![0].loc!.start > 0 ? error.nodes![0].loc!.start - addedLength : 0;
    // we add more characters with the defaultQuery so we should subtract it every time we try to find out string locations. 
    const end = error.nodes![0].loc!.end > 0 ? error.nodes![0].loc!.end - addedLength : 0;

    const startPos = activeEditor.document.positionAt(start);
    const endPos = activeEditor.document.positionAt(end);
    return {
      'range': new Range(startPos, endPos),
      'hoverMessage': `${error.message}[${error.ruleName}]`
    }
  })
  return decorationOptions;
}