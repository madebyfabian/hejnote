import objectEntriesAreEqual from '@/utils/objectEntriesAreEqual'

interface ObjectWithId extends Object {
	id: string
}


export const findValueById = <T extends ObjectWithId>({ arr, id }: { arr: T[], id: string }) => {
	if (!Array.isArray(arr))
		return undefined

	return arr.find(item => item.id === id)
}

export const findIndexById = <T extends ObjectWithId>({ arr, id }: { arr: T[], id: string }) => {
	if (!Array.isArray(arr))
		return -1

	return arr.findIndex(item => item.id === id)
}

export const insertValue = <T extends ObjectWithId>({ arr, newVal }: { arr: T[], newVal: T }) => {
	const index = findIndexById({ arr, id: newVal.id })
	if (index !== -1)
		return

	arr.push(newVal)
}

export const updateById = <T extends ObjectWithId, N extends Object>({ arr, id, newVal }: { arr: T[], id: string, newVal: N }) => {
	const index = findIndexById({ id, arr })
	const { result, newObject } = objectEntriesAreEqual(arr[index], newVal)
	if (result)
		return

	arr[index] = { ...arr[index], ...newObject }
}

export const deleteByIds = <T extends ObjectWithId>({ arr, ids }: { arr: T[], ids: string[] }) => {
	for (const id of ids) {
		const index = findIndexById({ arr, id })
		if (index === -1)
			continue

		arr.splice(index, 1)
	}
}


export default {
	findValueById,
	findIndexById,
	insertValue,
	updateById,
	deleteByIds,
}