# hejnote. app

## Project setup
Add new file `.env.local`
```
VUE_APP_SUPABASE_URL=YOUR_SUPABASE_URL_WITH_HTTPS_IN_FRONT
VUE_APP_SUPABASE_KEY=YOUR_API_KEY
```
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
I didn't used vues syntactic sugar, since it looses types and seems not stable enough. https://github.com/vuejs/rfcs/discussions/369