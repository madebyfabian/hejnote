/**
 * Takes in an url and returns true if it is a valid image url, undefined if not
 * @returns {boolean} true if valid, false if not
 */
export default async ({ url } = {}) => {
  return new Promise(( resolve ) => {
    if (!url)
      return resolve(false)

    let img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}