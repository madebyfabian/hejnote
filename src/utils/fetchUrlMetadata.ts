/** @see https://github.com/rocktimsaikia/meta-fetcher/blob/main/src/index.ts */
type Metadata = {
  metadata: {
    website: string;
    title: string;
    description: string | undefined;
    banner: string | undefined;
    themeColor: string | undefined;
  };
  socials: Record<string, string | undefined>;
  favicons: string[];
}


/**
 * Takes in an url and returns some metadata about it (title, description, image, etc.)
 * @param url - The url to fetch metadata for
 */
export default async ({ url }: { url: string }) => {
	try {
		if (!url)
      throw new Error('No url provided')

		const metadataAPIUrl = 
			'https://netlify-functions-madebyfabian.netlify.app/.netlify/functions/meta-fetcher?url=' 
			+ url
		const metadataRes = await fetch(metadataAPIUrl)
		const json = await metadataRes.json()

		if (!json?.metadata)
			return undefined

		return <Metadata>json.metadata

	} catch (error) {
		console.error(error)
	}
}