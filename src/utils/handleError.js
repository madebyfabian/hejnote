import useSnackbar from '@/hooks/useSnackbar'

export default ( error, { userMessage } = {} ) => {
	useSnackbar().createSnackbar({ message: userMessage || error.message })
	console.error(error)
}