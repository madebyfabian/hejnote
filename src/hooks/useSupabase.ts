import { createClient, SupabaseRealtimePayload } from '@supabase/supabase-js'
import { uuid as generateUUID } from '@supabase/supabase-js/dist/module/lib/helpers'
import arrayUtils, { ObjectWithId } from '@/utils/arrayUtils'
import handleError from '@/utils/handleError'
import { definitions } from '@/../types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL,
			supabaseKey = import.meta.env.VITE_SUPABASE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)


export type Collection = definitions['collections']
export type CollectionUpdate = Pick<Collection, 'title' | 'updated_at'>
export type CollectionUpdateParams = Pick<Collection, 'title'>
export type CollectionInsertParams = Partial<Pick<Collection, 'title'>>

export type Note = definitions['notes']
export type JoinNotesLinks = Modify<definitions['join_notes_links'], { 
  annotation: string | null
}>
export type JoinNotesLinksUpdateParams = Partial<Pick<JoinNotesLinks, 'annotation' | 'is_added_from_text' | 'is_in_text' | 'is_hidden'>>
export type JoinNotesLinksInsertParams = PartialBy<JoinNotesLinks, 'link_id' | 'note_id'>

export type Link = Modify<definitions['links'], { 
  title: string | null, 
  banner_url: string | null 
}>
export type LinkGeneratedByFunction = Link
export type LinkInsertParams = PartialBy<Link, 'url'>


const useSupabase = () => {
	return supabase
}

/**
 * Convert a JavaScript Date object to a string that suits the supabase datetime format.
 * Useful when performing updates of a row and you need to pass something for the `updated_at` field.
 * @returns ISO date string, without Z at the end, and without trailing zeros 
 * e.g. `2020-01-01T00:00:00.012`, `2020-01-01T00:00:00` or `2020-01-01T00:00:00.251`
 */
const formatTimeToSupabaseFormat = ({ date }: { date: Date }) => {
	let dateString = date.toISOString()
	dateString = dateString.replace('Z', '')

	let arr = dateString.split(':')
	let float = parseFloat(arr[arr.length - 1])
	arr[arr.length - 1] = String(float > 9 ? float : `0${ float }`)
	
	return arr.join(':')
}

const handleRealtimeEvent = async <T extends ObjectWithId>({ payload, stateArr }: { payload: SupabaseRealtimePayload<T>, stateArr: any[] }) => {
	try {
		if (payload.errors)
			throw new Error(JSON.stringify(payload.errors))

		switch (payload.eventType) {
			case 'INSERT': return arrayUtils.insertValue({ arr: stateArr, newVal: payload.new })
			case 'UPDATE': return arrayUtils.updateById({ arr: stateArr, id: payload.new.id, newVal: payload.new })
			case 'DELETE': return arrayUtils.deleteByIds({ arr: stateArr, ids: [ payload.old.id ] })
		}

	} catch (error) {
		handleError(error)
	}
}


export default useSupabase

export {
	useSupabase,
	generateUUID,
	handleRealtimeEvent,
	formatTimeToSupabaseFormat,
}