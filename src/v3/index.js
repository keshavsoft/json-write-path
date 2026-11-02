import actions from "./actions/index.js";
import resolveParent from "./resolveParent/index.js";
import { set } from "./actions/basic.js";

const writePath = (registry, path, value, showLog) => {
    const { parent, key } = resolveParent(registry, path);
    // console.log("parent, key : ", parent, key, value);

    const localAction = path.action;

    const action = actions[localAction] || set;

    action(parent, key, value);
};

export default writePath;