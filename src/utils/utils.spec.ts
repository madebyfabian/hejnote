// @ts-nocheck
import isImageValid from './isImageValid'
import fetchUrlMetadata from './fetchUrlMetadata'
import arrayUtils from './arrayUtils'


describe('"isImageValid": Check if image url loads and therefore is valid', () => {
  it('Should return false with invalid param', async () => {
    const results = await Promise.all([
      await isImageValid(),
      await isImageValid({}),
      await isImageValid({ url: undefined }),
      await isImageValid({ url: '' }),
      await isImageValid({ url: 'https://' }),
    ])

    results.forEach(result => expect(result).to.deep.equal({ validatedUrl: false }))
  })

  it('Should return false with a valid image url, but which only works in unsafe http, not https', async () => {
    const result = await isImageValid({ url: 'http://bla.com/iis-85.png' })
    expect(result).to.deep.equal({ validatedUrl: false })
  })

  it('Should return string with a valid image url, but upgrades it to https', async () => {
    const result = await isImageValid({ url: 'http://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png' })
    expect(result).to.deep.equal({ validatedUrl: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png' })
  })
})

describe('"fetchUrlMetadata": Should return metadata obj if something was fetched', () => {
  it('Should return undefined with invalid param', async () => {
    const results = await Promise.all([
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

describe('"arrayUtils.findIndexById": Should return index number or -1', () => {
  it('should return -1 with invalid params', () => {
    const results = [
      arrayUtils.findIndexById({}),
      arrayUtils.findIndexById({ arr: undefined }),
      arrayUtils.findIndexById({ arr: '' }),
      arrayUtils.findIndexById({ id: undefined }),
      arrayUtils.findIndexById({ id: undefined, arr: [] }),
      arrayUtils.findIndexById({ id: '9', arr: [{ id: '222' }] }),
    ]

    results.forEach(result => expect(result).to.equal(-1))
  })

  it('should return index number', () => {
    const results = [
      { input: arrayUtils.findIndexById({ id: '789', arr: [{ id: '123' }, { id: '456' }, { id: '789' }] }), output: 2 },
      { input: arrayUtils.findIndexById({ id: '22', arr: [{ id: '11' }, { id: '22' }] }), output: 1 },
      { input: arrayUtils.findIndexById({ id: '222', arr: [{ id: '222' }] }), output: 0 }
    ]

    results.forEach(result => expect(result.input).to.equal(result.output))
  })
})