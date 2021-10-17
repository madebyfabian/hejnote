/**
 * Returns an index of an object inside an array by its id field.
 * If something failed, it
 * @returns {Number} -1 if not found, otherwise index.
 */
export default ({ data = [], id } = {}) => {
	if (!Array.isArray(data))
		return -1

	return data.findIndex(obj => obj !== undefined && obj?.id === id)
}