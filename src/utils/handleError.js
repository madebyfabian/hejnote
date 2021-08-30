import { storeSnackbar } from '@/store/snackbar'

export default ( error ) => {
	storeSnackbar.createSnackbar({ message: error.message })
	console.error(error)
}