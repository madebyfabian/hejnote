import { mount } from '@cypress/vue'
import Avatar from './Avatar.vue'

const data = [
  { input: 'John', output: 'J' },
  { input: 'John Doe', output: 'JD' },
  { input: 'John Doe Doe', output: 'JD' },
  { input: 'John-Doe Foster', output: 'JF' },
  { input: 'John St. Foster', output: 'JF' },
  { input: 'john-st.foster@st.foster.edu.co.uk', output: 'JF' },
  { input: 'hello@example.com', output: 'H' },
  { input: '@', output: '-' },
  { input: '-', output: '-' },
  { input: ' ', output: '-' },
  { input: undefined, output: '-' },
  { input: null, output: '-' },
  { input: '', output: '-' },
]

data.forEach(item => {
  it(`with prop "name" being "${ item.input }"`, () => {
    mount(Avatar, {
      propsData: {
        name: item.input
      },
    })
  
    cy.get('span').should('have.text', item.output)
  })
})