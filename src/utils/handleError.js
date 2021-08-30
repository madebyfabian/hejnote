import { snackbarStore } from '@/store/snackbarStore'

export default ( error ) => {
	snackbarStore.createSnackbar({ message: error.message })
	console.error(error)
}