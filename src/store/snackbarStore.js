import { reactive } from 'vue'

export const snackbarStore = {
	state: reactive({
		snackbarInstances: [],
		snackbarTimeout: 6000
	}),

	createSnackbar({ message, buttonText = null, onButtonClick = () => {} }) {
		const newSnackbar = { 
			id: Math.random().toString(36).substr(2, 9), 
			message,
			buttonText,
			onButtonClick
		}

		this.state.snackbarInstances = [ newSnackbar, ...this.state.snackbarInstances ]

		setTimeout(() => this.removeSnackbar({ id: newSnackbar.id }), this.state.snackbarTimeout)
	},

	removeSnackbar({ id }) {
		// Get index
		const index = this.state.snackbarInstances.findIndex(snackbar => snackbar.id === id)
		if (index === -1) return

		// Remove snackbar
		this.state.snackbarInstances.splice(index, 1)
	}
}