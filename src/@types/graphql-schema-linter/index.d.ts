declare module 'graphql-schema-linter/lib/rules/fields_are_camel_cased' {
  import { ValidationContext, Visitor, ASTKindToNode } from 'graphql';
  export function FieldsAreCamelCased(context: ValidationContext): Visitor<ASTKindToNode>
}
declare module 'graphql-schema-linter/lib/rules/types_have_descriptions' {
  import { ValidationContext, Visitor, ASTKindToNode } from 'graphql';
  export function TypesHaveDescriptions(context: ValidationContext): Visitor<ASTKindToNode>
}
declare module 'graphql-schema-linter/lib/validation_error' {
  import { GraphQLError, ASTNode, validate } from 'graphql';
  export class ValidationError extends GraphQLError {
    constructor(moduleName: string, message: string, nodes: ASTNode[]);
  }
}

declare module 'graphql-schema-linter-extras/lib/lint-directive' {
  import { ValidationContext, ASTKindToNode, Visitor } from 'graphql';
  export function LintDirective(context: ValidationContext): Visitor<ASTKindToNode>;
}

declare module 'graphql-schema-linter/lib/validator' {
  import { ValidationContext, ASTKindToNode, Visitor, GraphQLError } from 'graphql';
  export type Rule = (context: ValidationContext) => Visitor<ASTKindToNode>;
  export function validateSchemaDefinition(
    schemaDefinition: string,
    rules: Rule[],
    configuration: Object
  ): GraphQLError[];
}

declare module 'graphql-schema-linter/lib/configuration' {
  export class Configuration {
    constructor(options: Configuration.ConfigurationOptions, stdinFd: string | null);
  }
}
/*
   options:
     - configDirectory: path to begin searching for config files
     - format: (required) `text` | `json`
     - rules: [string array] whitelist rules
     - schemaPaths: [string array] file(s) to read schema from
     - customRulePaths: [string array] path to additional custom rules to be loaded
     - stdin: [boolean] pass schema via stdin?
     - commentDescriptions: [boolean] use old way of defining descriptions in GraphQL SDL
     - oldImplementsSyntax: [boolean] use old way of defining implemented interfaces in GraphQL SDL
 */

declare namespace Configuration {
  export interface ConfigurationOptions {
    configDirectory?: string;
    format?: string | Object;
    rules?: string[];
    schemaPaths?: string[];
    stdin?: boolean;
    commentDescriptions?: boolean;
    oldImplementsSyntax?: boolean;
  }
}
