const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')
const lineClamp = require('@tailwindcss/line-clamp')


// Rotate X utilities
const rotateX = plugin(function ({ addUtilities }) {
  addUtilities({
    '.rotate-x-180': {
      transform: 'rotateX(180deg)',
    },
  })
})



/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],

  darkMode: false,

  theme: {
    container: {
      center: true,
      padding: '1.25rem',
    },

    screens: {
      'desktop': `${ 1024 + (1.25 * 16) * 2 }px` // Wrapper + padding left & right
    },

    borderWidth: {
      DEFAULT: '1.5px'
    },

    fontSize: {
      '200': [ '1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' } ],
      '150': [ '1rem', { lineHeight: '1.25rem', letterSpacing: '-0.02em' } ],
      '100': [ '0.875rem', { lineHeight: '1.25rem', letterSpacing: '-0.02em' } ],
      '050': [ '0.75rem', { lineHeight: '1.25rem', letterSpacing: '0.02em' } ],
    },

    extend: {
      fontFamily: {
        sans: ['"Inter var"', ...defaultTheme.fontFamily.sans],
      },
      transitionProperty: {
        'transform-bg': 'transform, background-color',
      },
      transitionDuration: {
        '225': '225ms',
      },
      height: {
        '15': '3.75rem',
      },
      zIndex: {
        '-1': '-1',
        '1': '1',
        '2': '2',
        '3': '3'
      },
      boxShadow: {
        'border-inset': 'inset 0 0 0 1.5px ' + defaultTheme.colors.gray[700],
      },
      width: {
        'fit': 'fit-content',
      }
    },
  },

  variants: {
    extend: {
      visibility: [ 'group-hover' ]
    }
  },

  plugins: [
    rotateX,
    lineClamp
  ],
}
