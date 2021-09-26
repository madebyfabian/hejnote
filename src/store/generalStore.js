import { reactive } from 'vue'

export default {
	state: reactive({
		user: undefined,
    isAppLoading: true,
		isHiddenMode: false
	}),

	// --- Mutations ---
	updateUser({ user }) {
		this.state.user = user
	},

	updateIsAppLoading({ isAppLoading }) {
		this.state.isAppLoading = isAppLoading
	},

	updateIsHiddenMode({ isHiddenMode }) {
		this.state.isHiddenMode = isHiddenMode
	}
}