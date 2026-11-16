# json-write-path V5

V5 adds JSONPathly-based destination-node discovery while preserving the existing write actions and legacy `dataRole` instructions.

## Destination descriptor

```json
{
  "fileName": "base",
  "jsonPath": "$..*[?@.attributes['data-role'] == 'table-colgroup']",
  "filePath": ["children"],
  "action": "push"
}
```

## Execution

1. `fileName` selects the registry root.
2. `jsonPath` locates exactly one destination node inside that root.
3. `filePath` selects the property to write (`children` in this example).
4. The existing action (`push`, `unshift`, `set`, `pushToRows`, etc.) performs the mutation.

If `jsonPath` is absent, V5 continues to support the previous `dataRole` lookup for compatibility.

JSONPathly is used only for node discovery. It does not replace the transformation stage or the action registry.
