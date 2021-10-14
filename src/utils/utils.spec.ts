// @ts-ignore
import isImageValid from './isImageValid'
// @ts-ignore
import fetchUrlMetadata from './fetchUrlMetadata'

describe('"isImageValid": Check if image url loads and therefore is valid', () => {
  it('Should return false with invalid param', async () => {
    const results = await Promise.all([
      await isImageValid(),
      await isImageValid({}),
      await isImageValid({ url: undefined }),
      await isImageValid({ url: '' }),
      await isImageValid({ url: 'https://' }),
    ])

    results.forEach(result => expect(result).to.equal(false))
  })

  it('Should return true with a valid image url that can be resolved', async () => {
    const results = await Promise.all([
      await isImageValid({ url: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png' }),
      await isImageValid({ url: 'https://supabase.io/new/brand-assets/supabase-logo-wordmark--dark.svg' }),
    ])

    results.forEach(result => expect(result).to.equal(true))
  })
})

describe('"fetchUrlMetadata": Should return metadata obj if something was fetched', () => {
  it('Should return undefined with invalid param', async () => {
    const results = await Promise.all([
      await fetchUrlMetadata(),
      await fetchUrlMetadata({}),
      await fetchUrlMetadata({ url: undefined }),
      await fetchUrlMetadata({ url: '' }),
      await fetchUrlMetadata({ url: 'https://' }),
    ])

    results.forEach(result => expect(result).to.equal(undefined))
  })

  it('Should return an object with metadata', async () => {
    const results = await Promise.all([
      await fetchUrlMetadata({ url: 'https://madebyfabian.com' }),
      await fetchUrlMetadata({ url: 'https://supabase.io' }),
    ])

    results.forEach(result => expect(result).to.be.an('object'))
  })
})