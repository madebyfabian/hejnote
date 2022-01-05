import useSupabase from '@/hooks/useSupabase'
import handleError from '@/utils/handleError'
import { definitions } from '@/../types/supabase'
import { 
	notesStore, 
	collectionsStore, 
	joinNotesLinksStore,
	linksStore,
} from '@/store'

type Collection = definitions['collections']

const supabase = useSupabase()


export default async function initAppData({ fetchHidden }: { fetchHidden: boolean }) {
	try {
		let reInitSubscriptions = true
		const colSelectorString = `is_hidden=eq.${ fetchHidden }`

		const existingSubscriptions = supabase.getSubscriptions()
		if (existingSubscriptions?.length === 1 && existingSubscriptions[0]?.topic.includes(colSelectorString))
			reInitSubscriptions = false

		// Fetch Data
		const res = await Promise.all([
			notesStore.notesFetch({ fetchHidden }),
			collectionsStore.collectionsFetch({ fetchHidden }),
			joinNotesLinksStore.joinNotesLinksFetch({ fetchHidden }),
			linksStore.linksFetch({ fetchHidden })
		])

		// Create realtime connections
		if (reInitSubscriptions) {
			await supabase.removeAllSubscriptions()
			
			await Promise.all([
				supabase
					.from<Collection>(`collections:${ colSelectorString }`)
					.on('*', payload => collectionsStore.handleRealtimeEvent(payload))
					.subscribe(),
				
				supabase
					.from<definitions['links']>(`links:${ colSelectorString }`)
					.on('*', payload => linksStore.handleRealtimeEvent(payload))
					.subscribe(),

				supabase
					.from<definitions['join_notes_links']>(`join_notes_links:${ colSelectorString }`)
					.on('*', payload => joinNotesLinksStore.handleRealtimeEvent(payload))
					.subscribe(),
			])
		}

		return res

	} catch (error) {
		handleError(error)
	}
}

export function removeAllSubscriptions() {
	supabase.removeAllSubscriptions()
}