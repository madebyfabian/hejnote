import { mount } from '@cypress/vue'
import HostnameLabel from './HostnameLabel.vue'

const data = [
  { input: 'https://airbnb.de/test/example?cool=yes', output: 'airbnb.de' },
	{ input: 'airbnb.de', output: 'airbnb.de' },
	{ input: 'https://airbnb.de', output: 'airbnb.de' },
	{ input: 'https://airbnb.co.uk', output: 'airbnb.co.uk' },
	{ input: 'https://airbnb', output: 'airbnb' },
	{ input: 'airbnb', output: 'airbnb' },

	// Invalid
  { input: '-', output: '-' },
  { input: ' ', output: '-' },
  { input: undefined, output: '-' },
  { input: null, output: '-' },
  { input: '', output: '-' },
]

data.forEach(item => {
  it(`with prop "url" being "${ item.input }"`, () => {
    mount(HostnameLabel, {
      propsData: {
        url: item.input
      },
    })
  
    cy.get('.HostnameLabel').should('have.text', item.output)
  })
})