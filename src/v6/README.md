# json-write-path V6

V6 keeps V5's JSONPathly destination discovery and existing write actions. It resolves exactly one node under `path.fileName`, then applies `filePath` and the configured action. Legacy `dataRole` lookup remains available for existing instructions.

JSONPath is a locator only; transformations and mutations remain separate.
