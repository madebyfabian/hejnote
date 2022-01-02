import { reactive } from 'vue'
import { User } from '@supabase/supabase-js'
import useLocalStorage from '@/hooks/useLocalStorage'

export default {
	state: reactive({
		user: undefined as User | undefined,
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
		return (this.state.user?.user_metadata?.name as string | undefined) || this.state.user?.email || 'Guest'
	},

	getUserId() {
		if (!this.state.user?.id)
			return ''

		return this.state.user.id
	},


	// --- Mutations ---
	updateUser({ user }: { user: User }) {
		this.state.user = user
	},

	updateIsAppLoading({ isAppLoading }: { isAppLoading: boolean }) {
		this.state.isAppLoading = isAppLoading
	},

	updateIsHiddenMode({ isHiddenMode }: { isHiddenMode: boolean }) {
		this.state.isHiddenMode = isHiddenMode
	},

	updateUpdateCollectionsModalVisible({ newVal }: { newVal: boolean }) {
		this.state.updateCollectionsModalVisible = newVal
	}
}