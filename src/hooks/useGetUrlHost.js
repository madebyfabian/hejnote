/**
 * Takes in a full url and then returns...
 * @param {string} fullUrl Full url
 * @returns {string} The hostname of the current URL, e.g. "foo.example.com"
 */
export default function useGetUrlHost( fullUrl ) {
	let title
	if (!fullUrl || fullUrl.length === 0 || fullUrl === '#' || fullUrl?.trim()?.length === 0)
		return undefined

	try {
		const urlInstance = new URL(fullUrl)
		title = urlInstance?.host || fullUrl
	} catch (error) {
		title = fullUrl
	}

	title = title.replace('www.', '')
	
	return title
}