import { computed, reactive, watch } from 'vue'
import generateRandomId from '@/utils/generateRandomId'

interface SnackbarBase {
	message: string,
	buttonText?: string | null,
	onButtonClick?: () => void,
}
interface Snackbar extends SnackbarBase {
	id: string
}
interface SnackbarParams extends SnackbarBase {
	timeout?: number
}

const state = reactive({
	snackbarInstances: [] as Snackbar[],
	snackbarTimeout: 6000
})


export default function useSnackbar() {
	const createSnackbar = ({ message, buttonText = null, onButtonClick = () => {}, timeout }: SnackbarParams) => {
		const newSnackbar: Snackbar = {
			id: generateRandomId(), 
			message,
			buttonText,
			onButtonClick
		}

		state.snackbarInstances.unshift(newSnackbar)

		setTimeout(() => removeSnackbar({ id: newSnackbar.id }), timeout || state.snackbarTimeout)

		return { remove: () => removeSnackbar({ id: newSnackbar.id }) }
	}

	const removeSnackbar = ({ id }: { id: Snackbar['id'] }) => {
		// Get index
		const index = state.snackbarInstances.findIndex(snackbar => snackbar.id === id)
		if (index === -1) return

		// Remove snackbar
		state.snackbarInstances.splice(index, 1)
	}

	return {
		// State
		snackbarInstances: computed(() => state.snackbarInstances),

		// Methods
		createSnackbar,
		removeSnackbar
	}
}