import { Rule } from 'graphql-schema-linter/lib/validator'
import { validateSchemaDefinition } from 'graphql-schema-linter/lib/validator';
import { Configuration } from 'graphql-schema-linter/lib/configuration';
import { TextEditor, Range, DecorationOptions } from 'vscode';

const DEFAULT_QUERY = `"Query root" type Query { "Field" a: String }`;

export type NamedLinter = [string, Rule];
type LintContent = { configuration: Configuration, content: string, activeEditor: TextEditor };
/**
 * For the AST parser to work correctly we need always the default Query in the fragment. 
 */

const addedLength = DEFAULT_QUERY.length;

export function lintContent({ content, configuration, activeEditor }: LintContent): DecorationOptions[] {
  const schemaString = `${DEFAULT_QUERY}${content}`;
  const rules = configuration.getRules();
  const errors = validateSchemaDefinition(schemaString, rules, configuration);
  console.log('found errors on the given schema: ', JSON.stringify(errors));

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