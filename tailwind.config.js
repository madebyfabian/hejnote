const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')
const lineClampPlugin = require('@tailwindcss/line-clamp')

const defaultBorderWidth = '1px'

const customUtilitiesPlugin = plugin(function ({ addUtilities, theme }) {
  addUtilities({
    '.rotate-x-180': {
      transform: 'rotateX(180deg)',
    },

    '.text-overflow-ellipsis': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },

    '.content': {
      content: 'attr(data-content)',
    },

    /**
     * Add utilties to style checkboxes. This is needed, since our Richtext editor tiptap will not add <input type="checkbox">
     * to the readonly mode HTML. so we have to use ::before and ::after to style the checkbox.
     * These styles will then also be used for a component like Checkbox.vue 
     */
    '.checkbox': {
      border: `${ defaultBorderWidth } solid ${ colors.gray[600] }`,
      borderRadius: defaultTheme.borderRadius.DEFAULT,
      height: '1rem',
      width: '1rem',
      transitionDuration: '100ms',
      transitionProperty: 'border-color, background-color',
    },
    '.checkbox-hoverable-el': {
      borderRadius: defaultTheme.borderRadius.DEFAULT,
      transitionDuration: '100ms',
      transitionProperty: 'background-color',

      '&:hover': {
        background: colors.gray[700]
      }
    },
    '.checkbox-checked': {
      background: colors.gray[600],
      borderColor: 'transparent'
    },
    '.checkbox-checked-icon': {
      background: colors.gray[400], // Icon color
      mask: `url('@/assets/icons/special/check.svg') no-repeat center center`,
      '-webkit-mask': `url('@/assets/icons/special/check.svg') no-repeat center center`,
    },

    /**
     * Add utilities to style Marker element. This is needed (see above).
     * This style will then also be used for a component like Marker.vue
     */
    '.marker': {
      height: '0.5rem',
      width: '0.5rem',
      borderRadius: '100%',
      border: `${ defaultBorderWidth } solid ${ colors.gray[600] }`,
    },

    '.focus-visible': {
      outline: 'none',
    },
  })
})



/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],

  corePlugins: {
    letterSpacing: false,
    lineHeight: false
  },

  theme: {
    container: {
      center: true,
      padding: '1.25rem',
    },

    screens: {
      'desktop': `1064px`, // Wrapper + padding left & right, 1024 + (1.25 * 16) * 2
      'mouse-only': { raw: '(pointer: fine)' },
      'touch-only': { raw: '(pointer: coarse)' },
    },

    borderWidth: {
      DEFAULT: defaultBorderWidth,
      '2': '0.125rem',
      '4': '0.25rem'
    },

    extend: {
      fontFamily: {
        sans:         ['"Inter var"', ...defaultTheme.fontFamily.sans],
        landingPage:  ['"Geomanist"', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        '200': [ '1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' } ],
        '150': [ '1rem', { lineHeight: '1.25rem', letterSpacing: '-0.02em' } ],
        '100': [ '0.875rem', { lineHeight: '1.25rem', letterSpacing: '-0.02em' } ],
        '050': [ '0.75rem', { lineHeight: '1.25rem', letterSpacing: '-0.02em' } ],
        '025': [ '0.75rem', { lineHeight: '1.25rem', letterSpacing: '0.02em' } ],
      },
      transitionProperty: {
        'transform-bg': 'transform, background-color',
        'max-height': 'max-height',
        'colors': 'background-color, border-color, color, fill, stroke, text-decoration-color'
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
        '3': '3',
        '60': '60',
        '70': '70'
      },
      boxShadow: {
        'border-inset': 'inset 0 0 0 1.5px ' + colors.gray[700],
      },
      maxHeight: {
        'none': 'none',
      },
      maxWidth: {
        '24': '6rem'
      },
      spacing: {
        'fit': 'fit-content',
        'safe-area-bottom': '34px', // 'env(safe-area-inset-bottom)',
      },
      scale: {
        '60': '.60',
      },
      ringWidth: {
        'DEFAULT': defaultBorderWidth,
      },
      borderRadius: {
        '2.5xl': '20px',
        'input': '0.75rem',
        'button': '0.75rem',
        'inherit': 'inherit',
      },
      inset: {
        'initial': 'initial',
      },
      colors: {
        gray: {
          '750-standaloneBorder': '#2B3645',
          '1000': '#0A0E1A'
        },
        green: colors.emerald, // v2 to v3 upgrade
      },
      opacity: {
        '85': '.85'
      }
    },
  },

  plugins: [
    customUtilitiesPlugin,
    lineClampPlugin
  ],
}
