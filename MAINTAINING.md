# Maintaining the compatibility fork

## Git remotes

Keep the GitHub fork relationship and use these remotes:

```text
origin       https://github.com/vitovt/obsidian-completed-area.git
upstream     https://github.com/DahaWong/obsidian-completed-area.git
patch-source https://github.com/tnypxl/obsidian-completed-area.git
```

`origin` is the writable maintenance fork. `upstream` is the original project.
`patch-source` records where the Editor API migration came from and can be
removed after the fork is published.

Fetch upstream changes before starting new work:

```bash
git fetch upstream
git switch main
git merge upstream/main
```

Resolve conflicts locally, run the checks, and push the merge to `origin`.

## Proposing changes upstream

Create a feature branch from the maintained `main` branch, push it to `origin`,
and open a pull request with:

- base repository: `DahaWong/obsidian-completed-area`
- base branch: `main`
- head repository: `vitovt/obsidian-completed-area`
- compare branch: the feature branch, or `main` for the complete compatibility update

Because this repository retains the original Git history and is a GitHub fork,
GitHub can calculate and merge the change normally. If the original author later
grants write access, the same commits can be pushed or merged into `upstream`.

## Publishing a BRAT release

1. Update the version in `manifest.json`, `package.json`, and `package-lock.json`.
2. Update `versions.json` when the minimum Obsidian version changes.
3. Run `npm ci`, `npm run lint`, and `npm run build`.
4. Commit the version update.
5. Create a tag matching the manifest version exactly, without a `v` prefix.
6. Push the branch and tag to `origin`.

For example:

```bash
git tag 0.2.1
git push origin main
git push origin 0.2.1
```

The release workflow builds the plugin and creates a GitHub release containing
`main.js` and `manifest.json`. BRAT can install the repository after that release
finishes successfully.
