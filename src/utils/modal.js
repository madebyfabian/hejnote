import { ref } from 'vue'

export const historyState = ref(history.state || {})

export async function showUserModal(id, router) {
	// add backgroundView state to the location so we can render a different view from the one
	const backgroundView = router.currentRoute.value.fullPath

	await router.push({
		name: 'user',
		params: { id },
		// state: { backgroundView },
	})

	history.replaceState({ ...history.state, backgroundView }, '')
	historyState.value = history.state
}

export function closeUserModal() {
	history.back()
}