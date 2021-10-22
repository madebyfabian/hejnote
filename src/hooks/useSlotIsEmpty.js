import { useSlots, computed, Comment } from 'vue'

/**
 * Checks if a slot is empty.
 */
export default function useSlotIsEmpty({ name = 'default' } = {}) {
	const slots = useSlots()

	return computed(() => {
		const slotContent = slots?.[name]?.()
		if (!slotContent)
			return true

		// If the slot refers to a DOM Comment, we can be sure that it's empty.
		const slotIsEmpty = slotContent?.findIndex(o => o.type !== Comment) === -1
		return slotIsEmpty
	})
}