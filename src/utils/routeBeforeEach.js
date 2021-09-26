import useConfirm from '@/hooks/useConfirm'
import useSupabase from '@/hooks/useSupabase'
import { generalStore, notesStore } from '@/store'

export const getRequiredAuthRedirect = ({ user, requiresAuth }) => {
	if (requiresAuth && !user)
		return { name: 'Auth' }

	if (!requiresAuth && user)
		return { name: 'App-Home' }

	return false
}

const _next = ({ to, next, options }) => {
	const hasOptions = options && typeof options === 'object' && Object.keys(options).length

	const newIsHiddenModeState = options?.params?.isHiddenMode?.length
		? !!options?.params?.isHiddenMode?.length 
		: !!to?.params?.isHiddenMode?.length 

	const oldIsHiddenModeState = generalStore.state.isHiddenMode

	if (newIsHiddenModeState !== oldIsHiddenModeState)
		generalStore.updateIsHiddenMode({ isHiddenMode: newIsHiddenModeState })

	return next(hasOptions ? options : undefined)
}

export default async ( to, from, next ) => {
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
	const user = useSupabase().auth.user()

	const requiredRedirect = getRequiredAuthRedirect({ user, requiresAuth })
	if (requiredRedirect) 
		return _next({ to, next, options: requiredRedirect, to })

	const fromIsHidden = from.params.isHiddenMode === 'hidden',
				toIsHidden = to.params.isHiddenMode === 'hidden'

	if (!fromIsHidden && toIsHidden) {
		const answer = await useConfirm().doConfirm({ 
			title: 'Open the hidden Collections?',
			question: 'This will give you access to all your hidden collections until you refresh the page.' 
		})

		if (!answer) {
			// Go back
			return _next({ to, next, options: {
				name: to.name, 
				query: to.query, 
				params: { 
					...to.params, 
					isHiddenMode: answer ? 'hidden' : null 
				} 
			}})
		}
	}

	// If the hidden mode changes in any direction (hidden -> not hidden; or not hidden -> hidden)
	if (fromIsHidden !== toIsHidden) {
		await notesStore.notesFetch({ fetchHidden: toIsHidden })
	}

	_next({ to, next })
}