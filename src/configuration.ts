import { workspace } from 'vscode';
import { Configuration } from 'graphql-schema-linter/lib/configuration';


export type schemaLinterConfiguration = () => Configuration;

export function schemaLinterConfiguration(): Configuration {
  const workspaceFolders = workspace.workspaceFolders;

  let configDirectory: string | undefined = undefined;

  if (workspaceFolders) {

    const { uri } = workspaceFolders[0]

    configDirectory = uri.path;

    console.log('configuration directory provided: ', configDirectory)
  }
  return new Configuration({ configDirectory }, null);
}