import * as vscode from 'vscode';
import { decorationTypeOptions } from './decorationTypeOptions';
import { getLinters } from './configuration';
import { lintContent } from './lintContent';


export async function activate(context: vscode.ExtensionContext) {
	let activeEditor = vscode.window.activeTextEditor;
	let timeout: NodeJS.Timer | undefined = undefined;
	const linters = await getLinters();
	const decorationType = vscode.window.createTextEditorDecorationType(decorationTypeOptions);

	if (activeEditor) {
		triggerUpdateDecorations();
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	function triggerUpdateDecorations() {
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

		const rangesToDecorate = lintContent({ content, linters, activeEditor });

		activeEditor.setDecorations(decorationType, rangesToDecorate);
	}
}
