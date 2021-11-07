import { reactive, computed, nextTick } from 'vue'
import useSnackbar from '@/hooks/useSnackbar'
import useSupabase from '@/hooks/useSupabase'
import handleError from '@/utils/handleError'
import findIndexById from '@/utils/findIndexById'

import generalStore from '@/store/generalStore'
import linksStore from '@/store/linksStore'

const supabase = useSupabase(),
			isHiddenMode = computed(() => generalStore.state.isHiddenMode)


export default {
	state: reactive({
		notes: [],

    editNoteId: null,
    editNoteModalVisible: false,

    createNoteStartWithNewLink: false,
    createNoteModalVisible: false,
	}),

  toggleNoteEditor({ editNoteId = null, isVisible = false } = {}) {
    this.state.editNoteId = editNoteId
		nextTick(() => this.state.editNoteModalVisible = isVisible)
  },

  toggleCreateNoteModal({ startWithNewLink = false, isVisible = true } = {}) {
    this.state.createNoteStartWithNewLink = startWithNewLink
    nextTick(() => this.state.createNoteModalVisible = isVisible)
  },


  /**
   * @returns {Object} A new, empty note object.
   */
  getNoteDefaultDataObject({ note } = {}) { return {
    id: 				    note?.id || undefined,
		title: 			    note?.title || '',
		content: 		    note?.content || this.getNoteDefaultDataContentObject(),
		is_pinned: 	    note?.is_pinned || false,
		is_hidden: 	    note?.is_hidden || false,
		is_archived:    note?.is_archived || false,
    is_locked:      note?.is_locked || false,
    collection_id:  note?.collection_id || null,
  }},

  /**
   * @returns {Object} A new, empty note.content object.
   */
  getNoteDefaultDataContentObject() { return {
    type: 'doc', content: [{ type: 'paragraph' }]
  }},

	async notesFetch({ fetchHidden = false } = {}) {
    try {
      const { data, error } = await supabase.from('notes').select('*').eq('is_hidden', fetchHidden)
      if (error) throw error

      this.state.notes = data

    } catch (error) {
      handleError(error)
    }
  },

  async notesUpsertSingle({ note, forceEvenWithoutChanges = false, updateDB = true, updateState = true }) {
    try {
      const noteId = note?.id
      const isNewNote = !noteId
      const noteObjInState = this.noteFindById({ noteId: note?.id })

      // Cancel if nothing changes AND we are not "forcing the function even without changes"
      if (!forceEvenWithoutChanges && !this.noteObjectHasChanges({ compareToNoteId: noteId, newVal: note }))
        return

      note.owner_id = generalStore.state.user.id
      if (isNewNote) {
        note.is_hidden = isHiddenMode.value
      }

      if (noteObjInState) {
        // If the value "is_archived" is being changed, we will also want to reset the pinned state.
        if (note.is_archived !== undefined && note.is_archived !== noteObjInState?.is_archived)
          note.is_pinned = false

        // If the value "is_hidden" is being changed, we will also want to remove the collection_id,
        // (since collections in hidden are different than collections in non-hidden).
        if (note.is_hidden !== undefined && note.is_hidden !== noteObjInState?.is_hidden)
          note.collection_id = null
      }

      // Update database
      let res
      if (updateDB) {
        res = await supabase.from('notes').upsert([ note ])
        if (res.error) throw res.error
      }

      // Update local state
      const newData = res?.data?.[0] || note
      if (updateState && newData?.id) 
        this._updateState({ notes: [ newData ] })
 
      return newData

    } catch (error) {
      handleError(error)
    }
  },

  async notesUpdateSingleCollectionId({ noteId, collectionId = null }) {
    const noteData = { ...this.noteFindById({ noteId }) } // Deep copy since it will be overriden by the upsert.
    const noteOldCollectionId = noteData?.collection_id

    await this.notesUpsertSingle({ note: { id: noteId, collection_id: collectionId } })

    useSnackbar().createSnackbar({ 
      message: collectionId ? 'Moved Note to collection' : 'Moved Note out of collection',
      buttonText: 'Undo',
      onButtonClick: () => {
        this.notesUpsertSingle({ note: { id: noteId, collection_id: noteOldCollectionId } })
      }
    })
  },

  async notesUpdateUnlinkCollections({ collectionIds }) {
    const { data, error } = await supabase.from('notes').update({ collection_id: null }).in('collection_id', collectionIds)
    if (error) throw error

    this._updateState({ notes: data })
  },

  async notesUpdateSingleDeletedState({ noteId, deleted_at = new Date() }) {
    try {
      await this.notesUpsertSingle({ note: { id: noteId, deleted_at: deleted_at } })

      const index = findIndexById({ id: noteId, data: this.state.notes })
      const noteData = this.state.notes[index]
      useSnackbar().createSnackbar({ 
        message: `Moved note ${ noteData.title && `<b>"${ noteData.title }"</b>` } ${ deleted_at == null ? 'out of the' : 'to the' } Trash.`,
        buttonText: 'Undo',
        onButtonClick: () => {
          this.notesUpsertSingle({ note: { id: noteId, deleted_at: (deleted_at == null) ? new Date() : null } })
        }
      })
      
    } catch (error) {
      handleError(error)
    }
  },

  async notesUpdateSingleArchivedState({ noteId, is_archived = false }) {
    try {
      await this.notesUpsertSingle({ note: { id: noteId, is_archived } })

      useSnackbar().createSnackbar({ 
        message: `Moved note ${ is_archived ? 'to archive' : 'out of archive' }.`,
        buttonText: 'Undo',
        onButtonClick: () => {
          this.notesUpsertSingle({ note: { id: noteId, is_archived: !is_archived } })
        }
      })

    } catch (error) {
      handleError(error)
    }
  },

  async notesUpdateSingleHiddenState({ noteId, is_hidden }) {
    try {
      is_hidden = is_hidden ?? isHiddenMode.value ?? false
      await this.notesUpsertSingle({ note: { id: noteId, is_hidden } })

      useSnackbar().createSnackbar({ 
        message: `Moved note ${ is_hidden ? 'to hidden' : 'out of hidden' }.`,
        buttonText: 'Undo',
        onButtonClick: () => {
          this.notesUpsertSingle({ note: { id: noteId, is_hidden: !is_hidden } })
        }
      })

    } catch (error) {
      handleError(error)
    }
  },

  async notesDelete({ noteIds, notifyUser = true }) {
    try {
      // Delete link joins and their links first.
      await linksStore.linksDeleteV2({ noteIds })

      // Delete from database
      const { error } = await supabase.from('notes').delete().in('id', noteIds)
      if (error) throw error

      // Delete from state
      this.state.notes = this.state.notes.filter(note => !noteIds.includes(note.id))

      if (notifyUser)
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

  noteObjectHasChanges({ compareToNoteId, newVal } = {}) {
    let oldVal = !compareToNoteId
      ? this.getNoteDefaultDataObject()
      : this.state.notes.find(note => note.id === compareToNoteId)

    const oldAndNew = { ...oldVal, ...newVal }
    return JSON.stringify(oldVal) !== JSON.stringify(oldAndNew)
  },

  /**
   * Checks if the note is completly empty.
   * This includes checking the note object isself, and also if there are any links.
   */
  isNoteObjEmpty({ note }) {
    if (!note)
      return true

    // Delete unneccessary object fields
    const { id, is_pinned, is_hidden, is_archived, is_locked, collection_id, ...defaultNote } = this.getNoteDefaultDataObject()

    const hasFieldsWithContent = !!Object.entries(defaultNote)
      .map(([ key, value ]) => JSON.stringify(defaultNote[key]) !== JSON.stringify(note[key]))
      .filter(Boolean)
      .length

    // Check if there are any links.
    const hasJoinNotesLinks = linksStore._findLinksByNoteIdsV2({ noteIds: [ note.id ] }).length
    
    if (!hasFieldsWithContent && !hasJoinNotesLinks)
      return true

    return false
  },

  isNoteContentEmpty({ noteContent }) {
    return JSON.stringify(this.getNoteDefaultDataContentObject()) === JSON.stringify(noteContent)
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
  },

  _updateState({ notes }) {
    for (const note of notes) {
      const index = findIndexById({ id: note?.id, data: this.state.notes })
      if (index > -1)
        this.state.notes[index] = { ...this.state.notes[index], ...note }
      else
        this.state.notes.push(note)
    }
  },
}