import {createElement} from "react";
import { getSvgs } from "./getSvgs";
export function SquaredIcon(icon, className = "", ...rest) {
    const svgs = getSvgs();
    const component = createElement(svgs[icon], {
        className,
        ...rest
    })
    return component
};