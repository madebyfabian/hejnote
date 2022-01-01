import { createClient } from '@supabase/supabase-js'
import { uuid as generateUUID } from '@supabase/supabase-js/dist/module/lib/helpers'

const supabaseUrl = <string>import.meta.env.VITE_SUPABASE_URL,
			supabaseKey = <string>import.meta.env.VITE_SUPABASE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)


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


export default useSupabase

export {
	useSupabase,
	generateUUID,
	formatTimeToSupabaseFormat,
}