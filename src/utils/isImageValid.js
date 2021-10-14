export default async ({ url } = {}) => {
  return new Promise(( resolve ) => {
    if (!url)
      return resolve(undefined)

    let img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(undefined)
    img.src = url
  })
}