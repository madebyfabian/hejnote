/**
 * Takes in an url and returns some metadata about it (title, description, image, etc.)
 * @param url - The url to fetch metadata for
 */
export default async ({ url } = {}) => {
	try {
		if (!url)
      throw new Error('No url provided')

		const metadataAPIUrl = 
			'https://netlify-functions-madebyfabian.netlify.app/.netlify/functions/meta-fetcher?url=' 
			+ url
		const metadataRes = await fetch(metadataAPIUrl)
		const json = await metadataRes.json()
		return json?.metadata

	} catch (error) {
		console.error(error)
	}
}