import { computed, reactive, watch } from 'vue'

const state = reactive({
	snackbarInstances: [],
	snackbarTimeout: 6000
})

export default function useSnackbar() {
	const createSnackbar = ({ message, buttonText = null, onButtonClick = () => {}, timeout }) => {
		const newSnackbar = { 
			id: Math.random().toString(36).substr(2, 9), 
			message,
			buttonText,
			onButtonClick
		}

		state.snackbarInstances.unshift(newSnackbar)

		setTimeout(() => removeSnackbar({ id: newSnackbar.id }), timeout || state.snackbarTimeout)
	}

	const removeSnackbar = ({ id }) => {
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