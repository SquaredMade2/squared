import pkg from '@squared/builder';
const {build} = pkg;

const elements = [
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
  'toast',
  "visually-hidden"
]

for (const element of elements) {
    build(`src/${element}/index.ts`)
}