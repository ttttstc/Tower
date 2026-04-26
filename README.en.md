# Tower

[中文](./README.md)

Tower is a local-first project management prototype with a strongly themed interface. Instead of splitting project work into disconnected admin pages, it connects overview, dashboard, detail, editing, and Excel import into one continuous experience.

The current visual system is organized around:

- Home: landscape overview with the tower scene
- Dashboard: bookshelf with book-spine items
- Detail / Edit / Import: scroll and paper-based workspaces

## Current Features

- Home overview: project title, goals, milestones, overall progress, and layer progress
- Item dashboard: layered item browsing, status visibility, assignee filtering, dependency lines, and quick create
- Item detail: overview, task breakdown, dependencies, progress log, risk, and owner summary
- Create / edit flow: title, layer, status, progress, assignee, dependencies, milestone tags, and notes
- Excel import: upload, field mapping, preview, validation, and write-back
- Persistence: `localStorage` drafts plus `tower.json` open / save
- Daily report: snapshot-based daily summary generation

## Pages

| Path | Purpose |
| --- | --- |
| `index.html` | Project home / strategic overview |
| `dashboard.html` | Item dashboard |
| `detail.html` | Item detail |
| `item-form.html` | Create / edit item |
| `mockup/import.html` | Excel import flow |

## Tech Shape

- Multi-page static HTML
- Native ES Modules
- Shared state store: `js/store.js`
- Shared theme: `tower-theme.css`
- Visual assets: `UX/resource/`

This is not a React app and does not require a build step to run.

## Quick Start

Use a local static server instead of opening pages directly with `file://`.

```powershell
cd D:\AI\workspace\Tower\.claude\worktrees\thirsty-grothendieck-e6a6bd
python -m http.server 8124
```

Then open:

- `http://127.0.0.1:8124/index.html`
- `http://127.0.0.1:8124/dashboard.html`

## Data Model

Project data is managed by `js/store.js` and currently includes:

- project metadata: name, goal, scope, acceptance criteria
- goal cards for the home page
- milestones as tags whose progress is calculated from tagged items
- items with title, layer, status, progress, assignee, dependencies, risk, notes, and milestone tags

Pages load the local draft by default and can also open or save a `tower.json` file from the dashboard.

## Repository Layout

```text
.
|- index.html
|- dashboard.html
|- detail.html
|- item-form.html
|- mockup/import.html
|- js/
|  |- store.js
|  |- ui.js
|  |- itemDrawer.js
|  |- layout.js
|  `- spring.js
|- UX/resource/
|- DESIGN.md
`- VISION.md
```

## Docs

- Product vision: [VISION.md](./VISION.md)
- Design baseline: [DESIGN.md](./DESIGN.md)

Both documents now describe the current shipped experience rather than the older 6-layer treemap concept.

## Current Scope

Tower is still a high-fidelity prototype / local-first MVP. The current product focus is:

- validating the continuous flow from home to dashboard to detail
- proving that themed spatial presentation improves project readability
- making file-first project data workflows practical

If you keep evolving the project, the best next step is to deepen this experience rather than flattening it into a generic admin dashboard.
