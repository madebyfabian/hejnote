import useSnackbar from '@/hooks/useSnackbar'

export default ( error: any, { userMessage = null } = {} as { userMessage: string | null } ) => {
	useSnackbar().createSnackbar({ message: userMessage || error.message })
	console.error(error)
}