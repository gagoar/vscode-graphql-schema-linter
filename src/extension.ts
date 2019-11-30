import * as vscode from 'vscode';
import { decorationTypeOptions } from './decorationTypeOptions';
import { schemaLinterConfiguration } from './configuration';
import { lintContent } from './lintContent';


export async function activate(context: vscode.ExtensionContext) {
	let activeEditor = vscode.window.activeTextEditor;
	let timeout: NodeJS.Timer | undefined = undefined;
	const decorationType = vscode.window.createTextEditorDecorationType(decorationTypeOptions);

	const configuration = schemaLinterConfiguration();

	if (activeEditor) {
		triggerUpdateDecorations({ configuration });
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			triggerUpdateDecorations({ configuration });
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {

			triggerUpdateDecorations({ configuration });
		}
	}, null, context.subscriptions);


	function triggerUpdateDecorations({ configuration }: { configuration: ReturnType<schemaLinterConfiguration> }) {
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}
		timeout = setTimeout(updateDecorations, 500);
	}

	async function updateDecorations() {
		if (!activeEditor) {
			return;
		}
		const content = activeEditor.document.getText();

		const rangesToDecorate = lintContent({ content, configuration, activeEditor });

		activeEditor.setDecorations(decorationType, rangesToDecorate);
	}
}
