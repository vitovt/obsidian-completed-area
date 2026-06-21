import { App, Notice, PluginSettingTab, Setting } from "obsidian";

import type CompletedAreaPlugin from "./main";

export default class CompletedAreaSettingTab extends PluginSettingTab {
	private readonly plugin: CompletedAreaPlugin;
	private readonly defaultHeaderName = "Completed";

	constructor(app: App, plugin: CompletedAreaPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Header level")
			.setDesc("Choose the heading level for the completed area.")
			.addDropdown((dropdown) => {
				for (let level = 1; level <= 6; level += 1) {
					const value = String(level);
					dropdown.addOption(value, `Heading ${value}`);
				}

				dropdown
					.setValue(this.plugin.setting.completedAreaHierarchy)
					.onChange(async (value) => {
						this.plugin.setting.completedAreaHierarchy = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Header name")
			.setDesc("Set the heading text for the completed area.")
			.addText((text) =>
				text
					.setPlaceholder(this.defaultHeaderName)
					.setValue(this.plugin.setting.completedAreaName)
					.onChange(async (value) => {
						this.plugin.setting.completedAreaName =
							value.trim() || this.defaultHeaderName;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Show icon on left sidebar")
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.setting.showIcon)
					.onChange(async (value) => {
						this.plugin.setting.showIcon = value;
						await this.plugin.saveSettings();
						new Notice(
							`Reload the app to see icon ${value ? "added" : "removed"}.`
						);
					});
			});
	}
}
