# json-write-path

[![npm version](https://img.shields.io/npm/v/json-write-path.svg?style=flat-square)](https://www.npmjs.com/package/json-write-path)
[![npm downloads](https://img.shields.io/npm/dm/json-write-path.svg?style=flat-square)](https://www.npmjs.com/package/json-write-path)
[![license](https://img.shields.io/npm/l/json-write-path.svg?style=flat-square)](https://github.com/keshavsoft/json-write-path)
[![Documentation](https://img.shields.io/badge/docs-live-brightgreen.svg?style=flat-square)](https://keshavsoft.github.io/json-write-path/)

> Declarative, in-memory JSON specification tree mutator for multi-tree registries. Locates target nodes via JSONPath or data-role anchors, resolves property paths, and applies deterministic mutation actions.

---

## 🔗 Official Links

- 🚀 **Live Documentation & Interactive Playground**: [https://keshavsoft.github.io/json-write-path/](https://keshavsoft.github.io/json-write-path/)
- 📦 **NPM Package**: [https://www.npmjs.com/package/json-write-path](https://www.npmjs.com/package/json-write-path)
- 💻 **GitHub Repository**: [https://github.com/keshavsoft/json-write-path](https://github.com/keshavsoft/json-write-path)

---

## 📦 Installation

```bash
npm install json-write-path
```

Or via yarn / pnpm:

```bash
yarn add json-write-path
# or
pnpm add json-write-path
```

---

## 💡 What it does

When assembling complex JSON specifications (such as table specifications, DOM trees, form definitions, or AST nodes), instructions need to read from one source, transform the data, and write the result into a specific location inside a target tree.

`json-write-path` handles the **write** step:

1. **Locates the destination node** inside a shared `registry` (e.g. `{ base, spec, data }`) using **JSONPath** (`jsonpathly`) or legacy `dataRole` anchors (`findByRole`).
2. **Navigates down through properties** via `filePath` (e.g. `['children']` or `['attributes', 'class']`).
3. **Applies a deterministic action** (`set`, `push`, `unshift`, `pushToRows`, `unshiftToRows`, `unshiftSerialToRows`).
4. **Returns the updated registry** for clean chaining.

---

## ⚙️ The 3-Act Execution Pipeline

Every write follows a strictly decoupled 3-act model:

```
Act 1: Resolve        registry + path  ──▶  { parent, key, target }
                           │
Act 2: Pick           actions[path.action] || set
                           │
Act 3: Write          action(parent, key, value) ──▶ returns registry
```

- **Act 1 (`resolveParent`)**: Locates the single destination node and descends down through `filePath` to expose `parent` and `key`.
- **Act 2 (`pick`)**: Resolves the action function from the action catalog. Defaults safely to `set`.
- **Act 3 (`write`)**: Mutates `parent[key]` in-place and returns the mutated `registry`.

---

## 🚀 Quick Start

```javascript
import writePath from "json-write-path";

const registry = {
  base: {
    tagName: "table",
    attributes: { "class": "table" },
    children: [
      {
        tagName: "colgroup",
        attributes: { "data-role": "table-colgroup" },
        children: []
      },
      {
        tagName: "tbody",
        attributes: { "data-role": "table-body" },
        children: [
          { tagName: "tr", children: [{ tagName: "td", textContent: "Alice" }] },
          { tagName: "tr", children: [{ tagName: "td", textContent: "Bob" }] }
        ]
      }
    ]
  }
};

// 1. Append a column specification into the colgroup via JSONPath
writePath(
  registry,
  {
    fileName: "base",
    jsonPath: "$..*[?@.attributes['data-role'] == 'table-colgroup']",
    filePath: ["children"],
    action: "push"
  },
  { tagName: "col", attributes: { width: "150px" } }
);

// 2. Prepend a numbered serial column to every row in tbody
writePath(
  registry,
  {
    fileName: "base",
    jsonPath: "$..*[?@.attributes['data-role'] == 'table-body']",
    filePath: ["children"],
    action: "unshiftSerialToRows"
  },
  { tagName: "td", attributes: { class: "serial-col" } }
);

console.log(JSON.stringify(registry.base, null, 2));
```

---

## 📋 Path Descriptor Specification

The `path` parameter passed to `writePath` defines how to find the target and what mutation to execute:

| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `fileName` | `string` | **Yes** | Root property key in `registry` (e.g. `"base"`, `"spec"`). Throws if not found. |
| `jsonPath` | `string` | **Recommended** | JSONPath expression executed by `jsonpathly`. **Must match exactly one node** in the tree. |
| `dataRole` | `string` | Optional | Backward-compatibility fallback if `jsonPath` is omitted. Finds node by `data-role` attribute. |
| `filePath` | `string[]` | **Yes** | Array of keys to descend through. The last item is `key`; preceding items resolve `parent`. |
| `action` | `string` | Optional | Action name. Defaults to `"set"` if omitted or unknown. |

---

## 🛠️ Built-in Actions

### Basic Actions (`single node`)
- **`set(parent, key, value)`**: Assigns `parent[key] = value`.
- **`push(parent, key, value)`**: Normalizes `value` with `toArray` and appends items to `parent[key]`.
- **`unshift(parent, key, value)`**: Normalizes `value` with `toArray` and prepends items to `parent[key]`.

### Row Actions (`fan-out across rows`)
- **`pushToRows(parent, key, value)`**: Iterates over each row in `parent[key]`, deep-cloning `value` via `structuredClone`, and appends to `row.children`.
- **`unshiftToRows(parent, key, value)`**: Deep-clones `value` and prepends to each row's `children`.
- **`unshiftSerialToRows(parent, key, value)`**: Clones `value`, sets `item.textContent = rowIndex + 1`, and prepends to each row's `children`.

---

## 📚 Complete Documentation

Visit the full documentation portal in the `docs/` folder:

- **[Main Documentation Portal](https://keshavsoft.github.io/json-write-path/)** (`docs/index.html`)
- **[The Story & Philosophy](https://keshavsoft.github.io/json-write-path/pages/the-story.html)** (`docs/pages/the-story.html`)
- **[Architecture & Pipeline](https://keshavsoft.github.io/json-write-path/pages/architecture.html)** (`docs/pages/architecture.html`)
- **[Actions Deep Dive](https://keshavsoft.github.io/json-write-path/pages/actions.html)** (`docs/pages/actions.html`)
- **[JSONPath Locator Guide](https://keshavsoft.github.io/json-write-path/pages/jsonpath-guide.html)** (`docs/pages/jsonpath-guide.html`)
- **[API Guide & Reference](https://keshavsoft.github.io/json-write-path/pages/api-guide.html)** (`docs/pages/api-guide.html`)

---

## 🏷️ Version History

- **v6 (Latest)**: Production JSONPathly integration with strict single-match verification, full ESM named and default exports, enhanced debug logging, and updated registry return.
- **v5**: Introduced `jsonpathly` query-based destination resolution alongside legacy `dataRole`.
- **v4**: Added optional `showLog` flag for diagnostic console output during path navigation.
- **v3**: Established the 3-Act write architecture (`resolveParent` &rarr; `pick` &rarr; `write`).
- **v1 – v2**: Monolithic validation prototypes (archived in `archive/`).

---

## 📄 License

MIT © KeshavSoft
