import CompletedAreaSettingTab from "./CompletedAreaSettingTab";
import CompletedAreaSetting from "./CompletedAreaSetting";
import {
	addIcon,
	Editor,
	EditorPosition,
	MarkdownView,
	Notice,
	Plugin,
} from "obsidian";

interface SelectedText {
	content: string;
	end: EditorPosition;
	start: EditorPosition;
}

addIcon(
	"completed-area",
	'<g id="icon" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><rect id="Rectangle" stroke="currentColor" stroke-width="8" x="20" y="20" width="60" height="60" rx="10"></rect><path d="M68.7153857,33.5033079 L72.0903697,35.8858648 C72.5415551,36.2043773 72.6491076,36.8283407 72.3305951,37.2795261 L72.2641586,37.3636708 L48.720426,64.1010398 C46.5305195,66.5880005 42.7391695,66.8288105 40.2522088,64.638904 C40.1258491,64.5276373 40.0042287,64.4111011 39.8876706,64.2896051 L28.6056533,52.5296259 C28.258873,52.1681543 28.2330404,51.6058741 28.5452158,51.2141283 L31.9837559,46.899139 C32.3279438,46.467221 32.9571019,46.3961018 33.3890199,46.7402897 C33.4274056,46.7708786 33.4634871,46.8042521 33.4969719,46.8401396 L42.8381754,56.8516325 C43.5917202,57.6592488 44.8572913,57.7030825 45.6649076,56.9495377 L45.7632746,56.8511374 L67.4072774,33.6382921 C67.7482521,33.2726022 68.3069198,33.2149531 68.7153857,33.5033079 Z" id="Path" fill="currentColor" fill-rule="nonzero"></path></g>'
);

export default class CompletedAreaPlugin extends Plugin {
	setting = new CompletedAreaSetting();
	private readonly completedItemRegex = /(\n?- \[x\] .*)/g;
	private completedAreaHeader = "";

	async onload(): Promise<void> {
		await this.loadSettings();

		if (this.setting.showIcon) {
			this.addRibbonIcon("completed-area", "Completed Area", () => {
				this.editSource();
			});
		}

		this.addCommand({
			id: "completed-area-shortcut",
			name: "Extract completed items",
			hotkeys: [{ modifiers: ["Ctrl"], key: "Enter" }],
			callback: () => {
				this.editSource();
			},
		});

		this.addSettingTab(new CompletedAreaSettingTab(this.app, this));
	}

	private async loadSettings(): Promise<void> {
		const loadedSettings = (await this.loadData()) as
			| Partial<CompletedAreaSetting>
			| null;
		Object.assign(this.setting, loadedSettings ?? {});
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.setting);
	}

	private editSource(): void {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) {
			new Notice("Please open a markdown file first.");
			return;
		}

		const editor = view.editor;
		const todoRegex = /-\s\[[\sx]\]\s/gi;
		const toggledText = this.toggleElement(editor, todoRegex, this.replaceTodo);
		const completedItems = this.extractCompletedItems(toggledText);
		if (completedItems) {
			const newText = this.refactorContent(toggledText, completedItems);
			editor.setValue(newText);
		}
	}

	private replaceTodo(this: void, startWith: string): string {
		return startWith.replace(/\[([\sx])\]/i, (_match, marker: string) =>
			marker.toLowerCase() === "x" ? "[ ]" : "[x]"
		);
	}

	private extractCompletedItems(text: string): Array<string> | null {
		if (!text) {
			return null;
		}

		const completedItems = text.match(this.completedItemRegex);

		if (!completedItems) {
			new Notice("No completed todos found.");
			return null;
		}

		return completedItems;
	}

	private refactorContent(content: string, items: Array<string>): string {
		const completedArea = this.formatItems(items, content);
		const header = this.completedAreaHeader.trimStart();
		const newContent = content
			.replace(this.completedItemRegex, "") // Remove completed items in main text
			.trimStart()
			.trimEnd();
		return this.isCompletedAreaExisted(content)
			? newContent.replace(header, `${header}${completedArea}`)
			: newContent + completedArea;
	}

	private formatItems(items: Array<string>, content: string): string {
		const header = this.makeCompletedHeader(content);
		const [firstItem, ...remainingItems] = items;
		const normalizedFirstItem = firstItem.startsWith("\n")
			? firstItem
			: `\n${firstItem}`;

		return `${header}${[normalizedFirstItem, ...remainingItems].join("")}`;
	}

	private makeCompletedHeader(content: string): string {
		this.completedAreaHeader =
			"\n" +
			"#".repeat(Number(this.setting.completedAreaHierarchy)) +
			` ${this.setting.completedAreaName}`;

		return this.isCompletedAreaExisted(content)
			? "" // if completed header already exists
			: this.completedAreaHeader;
	}

	private isCompletedAreaExisted(content: string): boolean {
		return !!content.match(RegExp(this.completedAreaHeader));
	}

	private toggleElement(
		editor: Editor,
		re: RegExp,
		subst: (match: string) => string
	): string {
		const selection = editor.somethingSelected();
		const selectedText = this.getSelectedText(editor);

		const newString = selectedText.content.replace(re, subst);
		editor.replaceRange(newString, selectedText.start, selectedText.end);

		// Keep cursor in the same place
		if (selection) {
			editor.setSelection(selectedText.start, {
				line: selectedText.end.line,
				ch: editor.getLine(selectedText.end.line).length,
			});
		}

		return editor.getValue();
	}

	private getSelectedText(editor: Editor): SelectedText {
		if (editor.somethingSelected()) {
			// Toggle to-dos under the selection
			const cursorStart = editor.getCursor("from");
			const cursorEnd = editor.getCursor("to");
			const content = editor.getRange(
				{ line: cursorStart.line, ch: 0 },
				{ line: cursorEnd.line, ch: editor.getLine(cursorEnd.line).length }
			);

			return {
				start: { line: cursorStart.line, ch: 0 },
				end: {
					line: cursorEnd.line,
					ch: editor.getLine(cursorEnd.line).length,
				},
				content: content,
			};
		} else {
			// Toggle the todo in the line
			const cursor = editor.getCursor();
			const lineNr = cursor.line;
			const contents = editor.getLine(lineNr);
			const cursorStart = {
				line: lineNr,
				ch: 0,
			};
			const cursorEnd = {
				line: lineNr,
				ch: contents.length,
			};
			const content = editor.getRange(cursorStart, cursorEnd);
			return { start: cursorStart, end: cursorEnd, content: content };
		}
	}
}
