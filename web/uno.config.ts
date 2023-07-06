// @ts-nocheck

import { defineConfig, presetAttributify, presetUno } from 'unocss'
export default defineConfig({
  shortcuts: {
    'wh-full': 'w-full h-full',
    'wh-screen': 'w-screen h-screen',
    'wh-auto': 'w-auto h-auto',
  },
  rules: [
    [/^bc-(.+)$/, ([, color]) => ({ 'border-color': `#${color}` })],
    // @ts-ignore
    [/^m-(\d+)$/, ([, d]) => ({ margin: `${d * 0.1}rem` })],
    [/^ml-(\d+)$/, ([, d]) => ({ 'margin-left': `${d * 0.1}rem` })],
    [/^mr-(\d+)$/, ([, d]) => ({ 'margin-right': `${d * 0.1}rem` })],
    [/^mt-(\d+)$/, ([, d]) => ({ 'margin-top': `${d * 0.1}rem` })],
    [/^mb-(\d+)$/, ([, d]) => ({ 'margin-bottom': `${d * 0.1}rem` })],
    [/^p-(\d+)$/, ([, d]) => ({ padding: `${d * 0.1}rem` })],
    [/^pl-(\d+)$/, ([, d]) => ({ 'padding-left': `${d * 0.1}rem` })],
    [/^pr-(\d+)$/, ([, d]) => ({ 'padding-right': `${d * 0.1}rem` })],
    [/^pt-(\d+)$/, ([, d]) => ({ 'padding-top': `${d * 0.1}rem` })],
    [/^pb-(\d+)$/, ([, d]) => ({ 'padding-bottom': `${d * 0.1}rem` })],
  ],
  theme: {
    // screens: {
    //   sm: '480px',
    //   md: '768px',
    //   lg: '976px',
    //   xl: '1440px',
    // },
    colors: {
      'blue': '#1fb6ff',
      'purple': '#7e5bef',
      'pink': '#ff49db',
      'orange': '#ff7849',
      'green': '#13ce66',
      'yellow': '#ffc82c',
      'gray-dark': '#273444',
      'gray': '#8492a6',
      'gray-light': '#d3dce6',
    },
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  },
  presets: [
    presetUno(), 
    presetAttributify(),
  ]
})
