import { reactive } from 'vue'
import useLocalStorage from '@/hooks/useLocalStorage'

export default {
	state: reactive({
		user: undefined,
    isAppLoading: true,
		isHiddenMode: false,
		updateCollectionsModalVisible: false,
	}),

	appOptions: {
		displayMode: useLocalStorage({ 
			key: 'hejnote_option_displayMode', 
			defaultValue: 'onlyOutsideCollections',
			validator: v => [ 'onlyOutsideCollections', 'all' ].includes(v),
		}),
	},


	// --- Getters ---
	getUserName() {
		return this.state.user?.user_metadata?.name || this.state.user?.email || 'Guest'
	},


	// --- Mutations ---
	updateUser({ user }) {
		this.state.user = user
	},

	updateIsAppLoading({ isAppLoading }) {
		this.state.isAppLoading = isAppLoading
	},

	updateIsHiddenMode({ isHiddenMode }) {
		this.state.isHiddenMode = isHiddenMode
	},

	updateUpdateCollectionsModalVisible({ newVal }) {
		this.state.updateCollectionsModalVisible = newVal
	}
}