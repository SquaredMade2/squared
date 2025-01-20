const exports = [
  'accordion',
  'badge',
  'card',
  'collapsible',
  'dialog',
  'hover-card',
  'progress',
  'sheet',
  'table',
  'toggle',
  'alert',
  'breadcrumb',
  'chart',
  'command',
  'dropdown-menu',
  'input',
  'scroll-area',
  'sidebar',
  'tabs',
  'toggle-group',
  'alert-dialog',
  'button',
  'checkbox',
  'context-menu',
  'form',
  'label',
  'select',
  'skeleton',
  'textarea',
  'tooltip',
  'avatar',
  'calendar',
  'cn',
  'date-picker',
  'hooks',
  'popover',
  'separator',
  'switch',
  'toast'
]

const buildExport = (element) => {
    return `"./${element}": {
      "import": {
        "types": "./dist/${element}/index.d.mts",
        "default": "./dist/${element}/index.mjs"
      },
      "require": {
        "types": "./dist/${element}/index.d.ts",
        "default": "./dist/${element}/index.js"
      }
    }`
}

let json = ""
for (const jExport of exports.sort()) {
    json += buildExport(jExport) + ","
}
console.log(json)