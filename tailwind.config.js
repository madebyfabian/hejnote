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

const defaultBorderWidth = '1.5px'



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
      DEFAULT: defaultBorderWidth
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
        '3': '3'
      },
      boxShadow: {
        'border-inset': 'inset 0 0 0 1.5px ' + defaultTheme.colors.gray[700],
      },
      width: {
        'fit': 'fit-content',
      },
      maxHeight: {
        'none': 'none',
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
    lineClamp,
    plugin(({ addUtilities }) => {
      addUtilities({
        '.content': {
          content: 'attr(data-content)',
        },

        /**
         * Add utilties to style checkboxes. This is needed, since our Richtext editor tiptap will not add <input type="checkbox">
         * to the readonly mode HTML. so we have to use ::before and ::after to style the checkbox.
         * These styles will then also be used for a component like Checkbox.vue 
         */
        '.checkbox': {
          border: `${ defaultBorderWidth } solid ${ defaultTheme.colors.gray[600] }`,
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
            background: defaultTheme.colors.gray[700]
          }
        },
        '.checkbox-checked': {
          background: defaultTheme.colors.gray[600],
          borderColor: 'transparent'
        },
        '.checkbox-checked-icon': {
          background: defaultTheme.colors.gray[400], // Icon color
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
          border: `${ defaultBorderWidth } solid ${ defaultTheme.colors.gray[600] }`,
        }
      })
    })
  ],
}
