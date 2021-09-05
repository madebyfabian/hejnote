/**
 * Takes in a full url and then returns...
 * @param {string} fullUrl Full url
 * @returns {string} The hostname of the current URL, e.g. "foo.example.com"
 */
export default function useGetUrlHost( fullUrl ) {
	let title

	try {
		const urlInstance = new URL(fullUrl)
		title = urlInstance?.host || fullUrl
	} catch (error) {
		title = fullUrl
	}

	title = title.replace('www.', '')
	
	return title
}