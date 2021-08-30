import useSnackbar from '@/hooks/useSnackbar'

export default ( error ) => {
	useSnackbar().createSnackbar({ message: error.message })
	console.error(error)
}