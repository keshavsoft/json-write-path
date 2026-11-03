import { findByRole } from "json-transformer-funcs";

const resolveParent = (registry, path, showLog) => {
    const localShowLog = showLog;
    const localFileName = path.fileName;
    const valueByRole = findByRole(registry[localFileName], path.dataRole);

    const root = path.dataRole ? valueByRole : registry[path.fileName];

    const keys = [...(path.filePath ?? [])];
    const key = keys.pop();
    const parent = keys.reduce((current, nextKey) => current[nextKey], root);

    return { parent, key };
};

export default resolveParent;