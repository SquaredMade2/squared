import { createElement, forwardRef } from "react";
export function createSquaredIcon(icon, className = "", ...rest) {
    const parser = new DOMParser();
    const svg = parser.parseFromString(icon, "image/svg+xml");
    console.log(svg)
};
createSquaredIcon("box")