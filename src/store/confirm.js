import { reactive } from 'vue'


const _initialState = {
  isVisible: false,
  question: null,
  title: null,
  answer: null,
}

export const storeConfirm = {
	state: reactive({ ..._initialState }),

	reset() {
		Object.assign(this.state, _initialState)
  },
}