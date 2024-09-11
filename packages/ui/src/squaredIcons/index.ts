import { globSync } from "glob"
const fs = require("node:fs");
const path = require("node:path");

const inputDirectory = "./svgs";
const outputDirectory = "./icons";

const svgFiles = globSync("*.svg", {cwd: inputDirectory})

for (const file of svgFiles) {
    const svgContent = fs.readFileSync(`${path.join(inputDirectory, file)}`, "utf8");
    const componentName = path.basename(file, ".svg");
    const reactComponent = createReactComponent(componentName, svgContent)
    fs.writeFileSync(outputDirectory, `${componentName}.tsx`, reactComponent)
}

function createReactComponent(name, svgContent) {
    const svgElement = svgContent.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i)[1];
    return `import React from 'react';

    interface ${name}Props {
      size?: number;
      color?: string;
      strokeWidth?: number;
      absoluteStrokeWidth?: boolean;
    }
    
    const ${name}: React.FC<${name}Props> = ({
      size = 24,
      color = 'currentColor',
      strokeWidth = 2,
      absoluteStrokeWidth = false,
    }) => {
      const scale = size / 24;
      const scaledStrokeWidth = absoluteStrokeWidth ? strokeWidth : strokeWidth / scale;
    
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke={color}
          strokeWidth={scaledStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          ${svgElement}
        </svg>
      );
    };
    
    export default ${name};
    `
}