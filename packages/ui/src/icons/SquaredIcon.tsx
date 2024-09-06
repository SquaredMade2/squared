import { createElement,forwardRef } from "react"
import { icons } from "./icons"
export const SquaredIcon = ({icon,className,...rest}) => {
    const component = forwardRef(() => createElement(icons[icon], {
        className,
        rest
    }))
    component.displayName = "SquaredIcon"
    return component
}