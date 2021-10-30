# Feature that tryies to implement a more native feeling modal on mobile
Problems:
- ModalV2 uses custom drag handlers, which causes to really bad performance on safari/iOS
- ModalV3 uses the new css scroll snap, problem here is, it's still not 120fps on iOS, and also has the
problem that we have to implement something like a scroll-prevent when we don't want the modal to be closable.
Also, listening to "scrollEnd" or something is not possible, so it's hard to track when the modal should be closed/stay open.

NOTE: it uses JS native scrollIntoView, which is not supported smoothly by safari. but can be activated in iOS settings.


---

# hejnote. app

## Project setup
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
