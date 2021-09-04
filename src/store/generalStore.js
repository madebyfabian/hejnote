import { reactive } from 'vue'

export default {
	state: reactive({
		user: undefined,
    isAppLoading: true,
	}),

	updateUser({ user }) {
		this.state.user = user
	},

	updateIsAppLoading({ isAppLoading }) {
		this.state.isAppLoading = isAppLoading
	}
}