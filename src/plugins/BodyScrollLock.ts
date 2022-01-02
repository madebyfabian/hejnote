import { Plugin } from 'vue'
import { enableBodyScroll, disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'

/**
 * Building our own plugin here because this one: https://github.com/phegman/v-scroll-lock doesn't work with vue 3
 */
const plugin: Plugin = {
  install: ( app, options ) => {
    app.directive('scroll-lock', {
      // On mount (inserted)
      mounted( el, binding ) {
        if (binding.value) {
          disableBodyScroll(el)
        }
      },

      updated( el, binding ) {
        if (binding.value) {
          disableBodyScroll(el)
        } else {
          enableBodyScroll(el)
        }
      },

      // On unmount (removed)
      unmounted( el ) {
        enableBodyScroll(el)
      }
    })
  },
}

export default plugin