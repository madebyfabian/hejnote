import useConfirm from '@/hooks/useConfirm'
import useSupabase from '@/hooks/useSupabase'

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

		return answer ? next() : next({ 
			name: to.name, 
			query: to.query, 
			params: { 
				...to.params, 
				isHiddenMode: answer ? 'hidden' : null 
			} 
		})
	}

	next()
}