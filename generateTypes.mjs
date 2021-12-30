import fs from 'fs'
import dotenv from 'dotenv'
import openapiTS from 'openapi-typescript'

const main = async () => {
	const { parsed: env } = dotenv.config({ path: '.env.local', silent: true })

	const output = await openapiTS(env.VITE_SUPABASE_URL + '/rest/v1/?apikey=' + env.VITE_SUPABASE_KEY)

	fs.writeFileSync('./types/supabase.d.ts', output)

	console.log('Generated types for Supabase!');
}

main()