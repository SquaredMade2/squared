import {globSync} from "glob";
export const getSvgs = () => {
    const svgs = globSync("*.svg", {cwd: "./svgs"})
    return svgs;
};