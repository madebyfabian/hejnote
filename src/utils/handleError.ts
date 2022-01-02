import useSnackbar from '@/hooks/useSnackbar'

export default ( error: Error, { userMessage = null }: { userMessage: string | null } ) => {
	useSnackbar().createSnackbar({ message: userMessage || error.message })
	console.error(error)
}