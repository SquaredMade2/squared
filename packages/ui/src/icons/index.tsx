import React from "react"
const ChevronLeft = () => {
    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        >
        <path d="m15 18-6-6 6-6" />
          <title>ChevronLeft</title>
      </svg>
    )
}
const createSquaredIcon = ({className, attributes}) => {
    const component = React.createElement("svg", {
        className,
        ...attributes
    })
}