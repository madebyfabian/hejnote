import { reactive, computed, nextTick } from 'vue'
import useSnackbar from '@/hooks/useSnackbar'
import useSupabase from '@/hooks/useSupabase'
import handleError from '@/utils/handleError'
import { noteEditorContentDefault } from '@/utils/constants'

import generalStore from '@/store/generalStore'
import linksStore from '@/store/linksStore'

const supabase = useSupabase(),
			isHiddenMode = computed(() => generalStore.state.isHiddenMode)

// Helper
const findIndexById = ({ data, id }) => {
  return data.findIndex(obj => obj !== undefined && obj.id === id)
}

export default {
	state: reactive({
		notes: [],
    editNoteId: null,
    editNoteModalVisible: false,
	}),

  getNoteDefaultDataObject({ note } = {}) { return {
    id: 				    note?.id || undefined,
		title: 			    note?.title || '',
		content: 		    note?.content || noteEditorContentDefault,
		is_pinned: 	    note?.is_pinned || false,
		is_hidden: 	    note?.is_hidden || false,
		is_archived:    note?.is_archived || false,
    collection_id:  note?.collection_id || null,
  }},

  noteObjectHasChanges({ compareToNoteId, newVal } = {}) {
    let oldVal = !compareToNoteId
      ? this.getNoteDefaultDataObject()
      : this.state.notes.find(note => note.id === compareToNoteId)

    const oldAndNew = { ...oldVal, ...newVal }
    return JSON.stringify(oldVal) !== JSON.stringify(oldAndNew)
  },

  openNoteEditor({ editNoteId }) {
		this.state.editNoteId = editNoteId

		nextTick(() => {
			this.state.editNoteModalVisible = true
		})
	},

	closeNoteEditor() {
    this.state.editNoteId = null

		nextTick(() => {
      this.state.editNoteModalVisible = false
		})
	},

	async notesFetch({ fetchHidden = false } = {}) {
    const { data, error } = await supabase.from('notes').select('*').eq('is_hidden', fetchHidden)
    if (error) 
      return console.error(error)

    this.state.notes = data
  },

  async notesFetchSingle({ noteId }) {
    // First fetch from database
    const { data: rowsArr, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', noteId)
    if (error) throw error

    // Update local state, Check if already in state
    const index = findIndexById({ id: noteId, data: this.state.notes })
    if (index > -1)
      this.notesUpdateSingle({ noteId, newVal: rowsArr[0] })
    else
      this.state.notes.push(rowsArr[0])
  },

  async notesUpdateSingle({ noteId, newVal, updateDB = true, updateState = true }) {
    try {
      if (updateDB) {
        if (!this.noteObjectHasChanges({ compareToNoteId: noteId, newVal }))
          return

        // Delete id column because it's not needed and supabase throws an error.
        newVal = { ...newVal }
        delete newVal?.id

        // Update database
        const { data, error } = await supabase.from('notes').update(newVal).eq('id', noteId)
        if (error) throw error
        newVal = data[0]
      }

      // Update local state
      if (updateState) {
        const index = findIndexById({ id: noteId, data: this.state.notes })
        const newData = { ...this.state.notes[index], ...newVal }
        this.state.notes[index] = newData
      }
    } catch (error) {
      handleError(error)
    }
  },

  async notesUpdateSingleCollectionId({ noteId, collectionId = null }) {
    await this.notesUpdateSingle({ noteId, newVal: { collection_id: collectionId } })

    useSnackbar().createSnackbar({ 
      message: collectionId ? 'Moved Note to collection' : 'Moved Note out of collection'
    })
  },

  async notesUpsertSingle({ newVal, updateDB = true, updateState = true }) {
    try {
      const hasChanges = this.noteObjectHasChanges({ compareToNoteId: newVal?.id, newVal })

      // If we are in hidden mode, the new val should also have this prop.
      newVal.is_hidden = isHiddenMode.value

      let res
      if (updateDB && hasChanges) {
        res = await supabase.from('notes').upsert([{ ...newVal, owner_id: generalStore.state.user.id }])
        if (res.error) throw res.error
      }

      const newData = res?.data?.[0] || newVal
      const isEmpty = (!newVal?.id && !hasChanges)
      if (updateState && !isEmpty) {
        const index = findIndexById({ id: newData?.id, data: this.state.notes })
        if (index > -1)
          this.state.notes[index] = { ...this.state.notes[index], ...newData }
        else
          this.state.notes.push(newData)
      }

      return newData
    } catch (error) {
      handleError(error)
    }
  },

  async notesUpdateSingleDeletedState({ noteId, deleted_at = new Date() }) {
    try {
      // Set deleted_at to now in database
      await this.notesUpdateSingle({ noteId, newVal: { deleted_at } })

      // Notify
      const index = findIndexById({ id: noteId, data: this.state.notes })
      const noteData = this.state.notes[index]
      useSnackbar().createSnackbar({ 
        message: `Moved note ${ noteData.title && `<b>"${ noteData.title }"</b>` } ${ deleted_at == null ? 'out of the' : 'to the' } Trash.`,
        buttonText: 'Undo',
        onButtonClick: () => {
          const newVal = { deleted_at: (deleted_at == null) ? new Date() : null }
          this.notesUpdateSingle({ noteId, newVal })
        }
      })
      
    } catch (error) {
      handleError(error)
    }
  },

  async notesDeleteV2({ noteIds }) {
    try {
      // Delete link joins and their links first.
      await linksStore.linksDeleteV2({ noteIds })

      // Delete from database
      const { error } = await supabase.from('notes').delete().in('id', noteIds)
      if (error) throw error

      // Delete from state
      this.state.notes = this.state.notes.filter(note => !noteIds.includes(note.id))

      useSnackbar().createSnackbar({ message: `Deleted ${ noteIds.length } note${ noteIds.length === 1 ? '' : 's' }` })
    
    } catch (error) {
      handleError(error)
    }
  },

  /**
   * Filters out basic things and 
   * @returns {Array} of Notes
   */
  getNotes({ includeDeleted = true, includeArchived = true } = {}) {
    return this.state.notes.filter(note => {
      if (note === undefined) return false

      // Hidden mode
      if (!isHiddenMode.value && note.is_hidden) return false
      if (isHiddenMode.value && !note.is_hidden) return false

      // Deleted
      if (!includeDeleted && note.deleted_at) return false

      // Archived
      if (!includeArchived && note.is_archived) return false

      return true
    })
  },

  /**
   * Returns a single note, or undefined if not found.
   * @returns {Object} note
   */
  noteFindById({ noteId }) {
    return this.getNotes().find(note => note.id === noteId)
  },

  notesFilterByCollection({ collectionId }) {
    const notes = this.getNotes({ includeArchived: false, includeDeleted: false })
    if (!collectionId) 
      return notes

    return notes.filter(note => note.collection_id === collectionId)
  },

  notesFilterOnlyWithoutCollection() {
    const notes = this.getNotes({ includeArchived: false, includeDeleted: false })
    return notes.filter(note => !note.collection_id)
  },

  notesFilterForTrash() {
    return this.getNotes().filter(note => note.deleted_at !== null)
  },

  notesFilterForArchive() {
    return this.getNotes({ includeDeleted: false }).filter(note => note.is_archived)
  }
}