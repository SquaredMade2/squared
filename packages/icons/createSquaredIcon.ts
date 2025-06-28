const svgRegex = /<svg[^>]*>([\s\S]*?)<\/svg>/i;
export default function createSquaredIcon(name: string, svgContent: string) {
	const match = svgContent?.match(svgRegex);
	const svgElement = match ? match[1] : "";

	return `import type { FC } from 'react';

interface ${name}Props {
    className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
  onClick?: (e: React.MouseEvent<SVGElement, MouseEvent>) => void;
}
    
export const ${name}: FC<${name}Props> = ({
    className = "",
    size = 24,
    color = 'currentColor',
    strokeWidth = 2,
    absoluteStrokeWidth = false,
  }) => {
    const scale = size / 24;
    const scaledStrokeWidth = absoluteStrokeWidth ? strokeWidth : strokeWidth / scale;
  
    return (
      <svg
        className={className}
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
      <title>${name}</title>
        ${svgElement}
      </svg>
    );
  };
    `;
}
