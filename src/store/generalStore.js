import { reactive, nextTick } from 'vue'

export default {
	state: reactive({
		user: undefined,
    isAppLoading: true,
    editNoteId: null,
    editNoteModalVisible: false,
	}),

	updateUser({ user }) {
		this.state.user = user
	},

	updateIsAppLoading({ isAppLoading }) {
		this.state.isAppLoading = isAppLoading
	},

	openNoteEditor({ editNoteId }) {
		this.state.editNoteId = editNoteId

		nextTick(() => {
			this.state.editNoteModalVisible = true
		})
	},

	closeNoteEditor() {
		this.state.editNoteModalVisible = false

		nextTick(() => {
			this.state.editNoteId = null
		})
	}
}