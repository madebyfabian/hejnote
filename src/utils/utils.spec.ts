// @ts-ignore
import isImageValid from './isImageValid'

// @ts-ignore
import fetchUrlMetadata from './fetchUrlMetadata'

//@ts-ignore
import findIndexById from './findIndexById'


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
      await fetchUrlMetadata({ url: 'https://99999999.com' }),
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

describe('"findIndexById": Should return index number or -1', () => {
  it('should return -1 with invalid params', () => {
    const results = [
      findIndexById(),
      findIndexById({}),
      findIndexById({ data: undefined }),
      findIndexById({ data: '' }),
      findIndexById({ id: undefined }),
      findIndexById({ id: undefined, data: [] }),
      findIndexById({ id: '9', data: [{ id: '222' }] }),
    ]

    results.forEach(result => expect(result).to.equal(-1))
  })

  it('should return index number', () => {
    const results = [
      { input: findIndexById({ id: '789', data: [{ id: '123' }, { id: '456' }, { id: '789' }] }), output: 2 },
      { input: findIndexById({ id: '22', data: [{ id: '11' }, { id: '22' }] }), output: 1 },
      { input: findIndexById({ id: '222', data: [{ id: '222' }] }), output: 0 }
    ]

    results.forEach(result => expect(result.input).to.equal(result.output))
  })
})