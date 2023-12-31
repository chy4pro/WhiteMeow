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
    'flex-col-start': 'flex flex-col items-center justify-start',
    'flex-row-start': 'flex flex-row items-center justify-start',
    'flex-col-end': 'flex flex-col items-center justify-end',
    'flex-row-end': 'flex flex-row items-center justify-end',
    'flex-col-between': 'flex flex-col items-center justify-between',
    'flex-row-between': 'flex flex-row items-center justify-between',
    'flex-col-around': 'flex flex-col items-center justify-around',
    'flex-row-around': 'flex flex-row items-center justify-around',
    'flex-col-evenly': 'flex flex-col items-center justify-evenly',
    'flex-row-evenly': 'flex flex-row items-center justify-evenly',
  },
  rules: [
    // 动态背景
    [
      /^uno-bg-(.*)$/,
      ([_, d]) => {
        let img = d.split('.')[0]
        let type = d.split('.')[1]
        return {
          background: `url('./src/assets/images/${img}.${type}')`,
          'background-size': '100% 100%',
          'background-repeat': 'no-repeat',
          'box-sizing': 'border-box'
        }
      }
    ],
    [
      /^uno-shadow-(.*)$/,
      ([_, d]) => {
        let shadow = d.split('+')[0].substring(1, d.split('+')[0].length - 1);
        let color = d.split('+')[1].substring(1, d.split('+')[1].length - 1);
        shadow = shadow.split(',').join(' ')
        //uno-shadow-[0px,4px,4px,0px]-[rgba(0,0,0,0.1)]
        return {
          'box-shadow': `${shadow} ${color}`
        }
      }
    ],
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '750px',
      lg: '1080px',
      xl: '1336px',
      '2xl': '1440px',
      '3xl': '1536px',
      '4xl': '1920px'
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
  ],
})
