import React from "react"
export default function makeSvgElement(svgFile) {
    const domParser = new DOMParser()
    const element = domParser.parseFromString(svgFile, "application/xml");
    console.log(element)
}