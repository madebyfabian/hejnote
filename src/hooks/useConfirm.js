import { computed, reactive, watch } from 'vue'

const _initalState = {
	isVisible: false,
  question: null,
  title: null,
	inputProps: null,
  answer: null,
}

const state = reactive({..._initalState})

export default function useConfirm() {
	const doConfirm = ({ question, title, inputProps }) => new Promise(resolve => {
		state.isVisible = true
		state.question = question
		state.title = title
		state.inputProps = inputProps

		const stopWatcher = watch(() => state.answer, ( newAnswer ) => {
			if (newAnswer !== null) {
				const answer = newAnswer
				_reset()
				stopWatcher()
				resolve(answer)
			}	
		})
	})

	const doAnswer = answer => {
		state.answer = answer
	}

	const _reset = () => {
		Object.assign(state, _initalState)
	}


	return {
		// State
		isVisible: 	computed(() => state.isVisible),
		question: 	computed(() => state.question),
		title: 			computed(() => state.title),
		inputProps: computed(() => state.inputProps),
		answer: 		computed(() => state.answer),

		// Methods
		doConfirm,
		doAnswer
	}
}