import useConfirm from '@/hooks/useConfirm'
import useSupabase from '@/hooks/useSupabase'
import { notesStore } from '@/store'

export const getRequiredAuthRedirect = ({ user, requiresAuth }) => {
	if (requiresAuth && !user)
		return { name: 'Auth' }

	if (!requiresAuth && user)
		return { name: 'App-Home' }

	return false
}

export default async ( to, from, next ) => {
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
	const user = useSupabase().auth.user()

	const requiredRedirect = getRequiredAuthRedirect({ user, requiresAuth })
	if (requiredRedirect) 
		return next(requiredRedirect)

	const fromIsHidden = from.params.isHiddenMode === 'hidden',
				toIsHidden = to.params.isHiddenMode === 'hidden'

	if (!fromIsHidden && toIsHidden) {
		const answer = await useConfirm().doConfirm({ 
			title: 'Open the hidden Collections?',
			question: 'This will give you access to all your hidden collections until you refresh the page.' 
		})

		if (!answer) {
			return next({ 
				name: to.name, 
				query: to.query, 
				params: { 
					...to.params, 
					isHiddenMode: answer ? 'hidden' : null 
				} 
			})
		}
	}

	// If the hidden mode changes in any direction (hidden -> not hidden; or not hidden -> hidden)
	if (fromIsHidden !== toIsHidden) {
		await notesStore.notesFetch({ fetchHidden: toIsHidden })
	}

	next()
}