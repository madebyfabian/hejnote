import { watch } from 'vue'
import { confirmStore } from '@/store/confirmStore' 


export default function useConfirm() {
	const confirm = ({ question, title }) => new Promise(resolve => {
		confirmStore.state.isVisible = true
		confirmStore.state.question = question
		confirmStore.state.title = title

		const stopWatcher = watch(() => confirmStore.state.answer, ( newAnswer ) => {
			if (newAnswer !== null) {
				const answer = newAnswer
				confirmStore.reset()
				stopWatcher()
				resolve(answer)
			}	
		})
	})

	const answer = answer => {
		confirmStore.state.answer = answer
	}

	return {
		confirm,
		answer
	}
}