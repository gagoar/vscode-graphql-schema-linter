import { GraphQLError, ValidationContext, Visitor, ASTKindToNode } from 'graphql';
import { TypesHaveDescriptions } from 'graphql-schema-linter/lib/rules/types_have_descriptions';
import { FieldsAreCamelCased } from 'graphql-schema-linter/lib/rules/fields_are_camel_cased';
import { Rule } from 'graphql-schema-linter/lib/validator'
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
  const errors: GraphQLError[] = validateSchemaDefinition(schemaString, linterFns, new Configuration({}, null));

  const decorationOptions = errors.map((error) => {
    // we add more characters with the defaultQuery so we should subtract it every time we try to find out string locations. 
    const start = error.nodes![0].loc!.start - addedLength;
    // we add more characters with the defaultQuery so we should subtract it every time we try to find out string locations. 
    const end = error.nodes![0].loc!.end - addedLength;

    const startPos = activeEditor.document.positionAt(start);
    const endPos = activeEditor.document.positionAt(end);
    return {
      'range': new Range(startPos, endPos),
      'hoverMessage': error.message
    }
  })
  return decorationOptions;
}