/** 
 * Helper to upgrade existing links like "www.xyz.de", "//link.org", "http://link.org" to "https://..."
 * @see https://stackoverflow.com/a/61934195/9899193 
 */
const _withHttps = (url) => {
  return url.replace(/^(?:(.*:)?\/\/)?(.*)/i, ( match, schemma, nonSchemmaUrl ) => {
    return schemma 
      ? match.replace(/^(http:)/i, 'https:') // Matched string already includes "http://...", so manually upgrade to https.
      : `https://${nonSchemmaUrl}`
  })
}


/**
 * Takes in an url and returns true if it is a valid image url, undefined if not
 * @returns {{ validatedUrl: String | Boolean }} string of validated url if valid, null if not
 */
export default async ({ url } = {}) => {
  return new Promise(( resolve ) => {
    if (!url?.length || typeof url !== 'string')
      return resolve({ validatedUrl: false })

    // Upgrade to https
    url = _withHttps(url)

    let img = new Image()
    img.onload = () => resolve({ validatedUrl: url })
    img.onerror = () => resolve({ validatedUrl: false })
    img.src = url
  })
}