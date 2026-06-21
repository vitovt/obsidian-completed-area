# Completed Area

> [!IMPORTANT]
> This repository is a maintained compatibility fork of
> [DahaWong/obsidian-completed-area](https://github.com/DahaWong/obsidian-completed-area).
> It keeps the original plugin ID and history while restoring support for the
> current Obsidian editor API. The compatibility work is based on
> [tnypxl's patch](https://github.com/tnypxl/obsidian-completed-area/commit/7d0cfa19aca7cd1dfdf9506f58b635a61242087a).

En | [简](README_zh.md)

⚠️ *This plugin may contain bugs, and more features are developing.*

![Demo](https://raw.githubusercontent.com/DahaWong/obsidian-completed-area/main/demo.png)

## Installation

### BRAT

1. Install and enable [BRAT](https://github.com/TfTHacker/obsidian42-brat).
2. Run **BRAT: Add a beta plugin for testing** from the command palette.
3. Enter `vitovt/obsidian-completed-area`.
4. Enable **Completed Area** in **Settings → Community plugins**.

This fork uses the same `completed-area` plugin ID as the original. Install only
one copy.

### Manual installation

Download `main.js` and `manifest.json` from the
[latest release](https://github.com/vitovt/obsidian-completed-area/releases/latest),
place them in `<vault>/.obsidian/plugins/completed-area/`, and reload Obsidian.

## Use

It toggles the item and moves the **completed to-do items** to a separate completed area by:

- Clicking the icon on left sidebar, or
- Using shortcut: `Control + Enter` *(default)*

## Preference

### Set header level

Set the completed-area heading level from `1` to `6`, corresponding to `h1` through `h6`.

Default is `2`, i.e.`h2`.

### Set header name

Default is `Completed`.

### Show icon or not

You can turn sidebar icon off and use command instead, if you don't like sidebar icons.

## Development

Requirements: Node.js 20 or newer.

```bash
npm ci
npm run lint
npm run build
```

The production build creates `main.js`. Tagged releases automatically attach
the compiled file and manifest required by Obsidian and BRAT.

## Project lineage

The repository is intended to remain a GitHub fork, not a detached copy. Changes
are kept in focused commits so they can be proposed back to the original author.
If maintenance is transferred later, the same commits can be merged into the
original repository without rewriting plugin history.

## Credits

1. [Hotkey++ Plugin](https://github.com/argenos/hotkeysplus-obsidian)
2. [Arik Jones (tnypxl)](https://github.com/tnypxl) for the modern Editor API patch

---

<p align=center>
  ☕️ To express your thankfulness: <a href="https://buymeacoffee.com/daha">Buy Me a Coffee</a>
</p>
