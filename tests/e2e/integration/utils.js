// https://docs.cypress.io/api/introduction/api.html

/*describe('Homepage', () => {
  it('Shows correct text', () => {
    cy.visit('/')

    cy.contains('h2', 'Hello World Component')
  })
})*/

const isImageValid = require('../../../src/utils/isImageValid')

describe('Check if image url loads with "isImageValid"', () => {
  it('Should return undefined with a non-image url', async () => {
    const result = await isImageValid({ url: 'https://google.com' })
    expect(result).to.equal(undefined)
  })

  it('Should return undefined with undefined as url', async () => {
    const result = await isImageValid({ url: undefined })
    expect(result).to.equal(undefined)
  })

  it('Should return undefined with empty string as url', async () => {
    const result = await isImageValid({ url: '' })
    expect(result).to.equal(undefined)
  })

  it('Should return undefined with number as url', async () => {
    const result = await isImageValid({ url: 0 })
    expect(result).to.equal(undefined)
  })

  it('Should return undefined with no param', async () => {
    const result = await isImageValid()
    expect(result).to.equal(undefined)
  })

  it('Should return true with a valid image url', async () => {
    const result = await isImageValid({ url: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png' })
    expect(result).to.equal(true)
  })
})
