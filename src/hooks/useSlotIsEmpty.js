import { useSlots, computed, Comment, Fragment } from 'vue'

/**
 * Checks if a slot is empty.
 */
export default function useSlotIsEmpty({ name = 'default' } = {}) {
	const slots = useSlots()

	return computed(() => {
		const slotContent = slots?.[name]?.()
		if (!slotContent)
			return true

		const slotIsEmpty = slotContent?.findIndex(o => {
			// If the slot refers to a DOM Comment, we can be sure that it's empty.
			if (o.type === Comment)
				return false

			// If the slot refers to a Vue Fragment with nothing init, we can be sure that it's empty.
			if (o.type === Fragment && o.children instanceof Array && o.children.length === 0)
				return false

			return true
		}) === -1

		return slotIsEmpty
	})
}