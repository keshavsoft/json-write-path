import { query } from "jsonpathly";
import { findByRole } from "json-transformer-funcs";

const resolveParent = (registry, path, showLog) => {
    const root = registry?.[path.fileName];

    if (root === undefined) {
        throw new Error(`Registry entry not found: ${path.fileName}`);
    }

    let target = root;

    if (path.jsonPath) {
        const matches = query(root, path.jsonPath, { returnArray: true });

        if (matches.length === 0) {
            throw new Error(`Destination JSONPath matched no nodes: ${path.jsonPath}`);
        }

        if (matches.length > 1) {
            throw new Error(
                `Destination JSONPath must identify exactly one node; matched ${matches.length}: ${path.jsonPath}`
            );
        }

        target = matches[0];
    } else if (path.dataRole) {
        // Backward compatibility for existing destination instructions.
        target = findByRole(root, path.dataRole);

        if (target === undefined || target === null) {
            throw new Error(`Destination dataRole not found: ${path.dataRole}`);
        }
    }

    const keys = [...(path.filePath ?? [])];

    if (keys.length === 0) {
        throw new Error("destinationPath.filePath must contain the property to write");
    }

    const key = keys.pop();
    const parent = keys.reduce((current, nextKey) => {
        if (current === null || current === undefined) {
            throw new Error(`Cannot resolve destination filePath at: ${nextKey}`);
        }
        return current[nextKey];
    }, target);

    if (parent === null || parent === undefined) {
        throw new Error(`Destination parent not found for filePath: ${path.filePath.join(".")}`);
    }

    if (showLog) {
        console.log("json-write-path v5 resolved:", {
            fileName: path.fileName,
            jsonPath: path.jsonPath,
            dataRole: path.dataRole,
            filePath: path.filePath,
            parent,
            key
        });
    }

    return { parent, key, target };
};

export default resolveParent;
