import { watch } from 'vue'
import { store } from '@/store' 


export default function useConfirm() {
	const confirm = ({ question, title }) => new Promise(resolve => {
		store.confirmState.isVisible = true
		store.confirmState.question = question
		store.confirmState.title = title

		const stopWatcher = watch(() => store.confirmState.answer, ( newAnswer ) => {
			if (newAnswer !== null) {
				const answer = newAnswer
				store.resetConfirmState()
				stopWatcher()
				resolve(answer)
			}	
		})
	})

	const answer = answer => {
		store.confirmState.answer = answer
	}

	return {
		confirm,
		answer,
		confirmState: store.confirmState
	}
}