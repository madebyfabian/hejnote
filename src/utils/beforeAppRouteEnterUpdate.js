import useConfirm from '@/hooks/useConfirm'

export default async ( to, from, next ) => {
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