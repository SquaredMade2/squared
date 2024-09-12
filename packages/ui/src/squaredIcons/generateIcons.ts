const fs = require("node:fs")
import { getSvgPaths } from "./getSvgPaths";
function minifySvg(string) {
    return string
      ? string
          .replace(/>[\r\n ]+</g, '><')
          .replace(/(<.*?>)|\s+/g, (m, $1) => $1 || ' ')
          .trim()
      : '';
  }
export default function generateIcons() {
    const [iconsNames, svgPaths] = getSvgPaths();
    const svgStrings = svgPaths.map((path: string) => {
        const data = fs.readFileSync(path, "utf8")
        return minifySvg(data.toString())
    })
    const icons = {};
    return svgStrings;
}
const icons = generateIcons();