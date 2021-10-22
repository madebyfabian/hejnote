import { useSlots, Comment } from 'vue'

export default function useSlotIsEmpty({ name } = {}) {
	let slots
	try {
		slots = useSlots()
	} catch (error) {
		console.error(error)
		return false
	}

	const slotContent = slots?.[name]?.()
	const slotIsEmpty = slotContent?.findIndex(o => o.type !== Comment) === -1

	return slotIsEmpty
}