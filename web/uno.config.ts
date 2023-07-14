import { defineConfig, presetAttributify, presetUno, transformerDirectives, presetIcons } from 'unocss'

const remRE = /(-?[\.\d]+)rem/g

export default defineConfig({
  transformers: [
    transformerDirectives(),
  ],

  shortcuts: {
    'wh-full': 'w-full h-full',
    'wh-screen': 'w-screen h-screen',
    'wh-auto': 'w-auto h-auto',
    'flex-center': 'flex items-center justify-center',
    'flex-col-center': 'flex flex-col items-center justify-center',
    'flex-row-center': 'flex flex-row items-center justify-center',
    'flex-col-start': 'flex flex-col items-start justify-start',
    'flex-row-start': 'flex flex-row items-start justify-start',
    'flex-col-end': 'flex flex-col items-end justify-end',
    'flex-row-end': 'flex flex-row items-end justify-end',
    'flex-col-between': 'flex flex-col items-between justify-between',
    'flex-row-between': 'flex flex-row items-between justify-between',
    'flex-col-around': 'flex flex-col items-around justify-around',
    'flex-row-around': 'flex flex-row items-around justify-around',
    'flex-col-evenly': 'flex flex-col items-evenly justify-evenly',
    'flex-row-evenly': 'flex flex-row items-evenly justify-evenly',
  },
  rules: [

  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
      '2xl': '1536px'
    },
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
      maxWidth: {
        '1/2': '50%',
      },
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
    presetIcons({
      /* options */
      prefix: 'i-',
      extraProperties: {
        display: 'inline-block'
      }
    })
  ]
})
