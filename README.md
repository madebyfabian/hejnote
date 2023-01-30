![Cover Art](.github/cover.jpg?raw=true "Cover Art")
# hejnote. app

![Beta](https://img.shields.io/badge/status-inactive-red)<br>

---

This project is now inactive, so I don't currently work on it.

---

A Supabase-powered Vue.js app which aims to replace Google Keep. Open Source. Free. Currently in Closed Beta.<br>
A personal project of mine to finally use Vue 3, TypeScript, Supabase, Tailwind and other Technologies in a Production-ready app.
<br>

## Here is what you get
✅ A richtext markdown note-editor that allows you to create and edit notes, add to-do items, etc<br>
✅ Manually creating and updating linklists<br>
✅ Creating collections where you can move notes inside<br>
✅ Choose between displaying all notes from all collections or just the ones that aren't in one<br>
✅ Features a hidden mode, where you can save your private stuff<br>
✅ Open Source and Free to use<br>
✅ Built on Supabase, a modern PostgreSQL database that is easy to use, safe (with features like RLS) and fast<br>

## Dev Project setup
Add new file `.env.local`
```
VUE_APP_SUPABASE_URL=YOUR_SUPABASE_URL_WITH_HTTPS_IN_FRONT
VUE_APP_SUPABASE_KEY=YOUR_API_KEY
```
And add file `src/views/App/App-Test.vue` with some testing stuff in it.

And then
```
npm install
```

### Compiles and hot-reloads for development
```
npm start
```

### Compiles and minifies for production
```
npm run build
```

## Useful packages
Outside click: https://www.npmjs.com/package/click-outside-vue3

## Useful extensions
- `index.js` files are built with "JS Index" extension. Options:
	- Default template: `export { default as ${variable} } from ${relpathwithext}`
	- Quotes: `single`


## Other notes
- I didn't used vues syntactic sugar, since it looses types and seems not stable enough. https://github.com/vuejs/rfcs/discussions/369
- I use `vue-window-size` instead of `@vueuse/core` useWindowSize() because the package does only regiester one event listner, while vueuse registers many (for each usage of the hook 1 listener).
- The package `body-scroll-lock` is fine, but can't be used in the 4.0.0-beta-0, because it breaks ios safari. It scrolls to the whole top of the page all the time when opening a modal.


## Vue router routes as modals:
https://github.com/vuejs/vue-router-next/blob/master/e2e/modal/index.ts
(there are problems with routing (when clicking back/forward) and when loading the page new)
