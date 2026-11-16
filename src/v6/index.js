import actions from "../v4/actions/index.js";
import resolveParent from "./resolveParent.js";
import { set } from "../v4/actions/basic.js";

const writePath = (registry, path, value, showLog) => {
    const { parent, key } = resolveParent(registry, path, showLog);
    const action = actions[path.action] || set;
    action(parent, key, value);
    return registry;
};

export { resolveParent };
export default writePath;
