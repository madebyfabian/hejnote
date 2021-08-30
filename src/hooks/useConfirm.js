import { watch } from 'vue'
import { storeConfirm } from '@/store/confirm' 


export default function useConfirm() {
	const confirm = ({ question, title }) => new Promise(resolve => {
		storeConfirm.state.isVisible = true
		storeConfirm.state.question = question
		storeConfirm.state.title = title

		const stopWatcher = watch(() => storeConfirm.state.answer, ( newAnswer ) => {
			if (newAnswer !== null) {
				const answer = newAnswer
				storeConfirm.reset()
				stopWatcher()
				resolve(answer)
			}	
		})
	})

	const answer = answer => {
		storeConfirm.state.answer = answer
	}

	return {
		confirm,
		answer
	}
}