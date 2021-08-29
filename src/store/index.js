import { computed, reactive } from 'vue'
import { storeSnackbar } from '@/store/snackbar' 
import useSupabase from '@/hooks/useSupabase'
import useIsHiddenMode from '@/hooks/useIsHiddenMode'

const supabase = useSupabase(),
      isHiddenMode = useIsHiddenMode()

const _initialConfirmState = {
  isVisible: false,
  question: null,
  title: null,
  answer: null,
}

export const store = {
  /**
   * Default State
   */
  state: reactive({
    user: undefined,
    isAppLoading: true,
    notes: [],
    collections: [],
    joinNotesCollections: [],
    editNoteId: null,
    editNoteModalVisible: false
  }),

  _handleError(error) {
    storeSnackbar.createSnackbar({ message: error.message })
    console.error(error)
  },


  /**
   * Notes
   */
  async notesFetch() {
    const { data, error } = await supabase
      .from('notes')
      .select('*')

    if (error) 
      console.error(error)

    this.state.notes = data
  },

  async notesFetchSingle({ noteId, updateState = true }) {
    // First fetch from database
    const { data: rowsArr, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', noteId)
    if (error) throw error

    // Update local state, Check if already in state
    if (updateState) {
      const index = this.notesFindIndex({ noteId })
      if (index > -1)
        this.notesUpdateSingle({ noteId, newVal: rowsArr[0] })
      else
        this.state.notes.push(rowsArr[0])
    }
  },

  async notesInsertSingle({ newVal, updateState = true }) {
    // Delete id column because it's not needed and supabase throws an error.
    newVal = { ...newVal }
    delete newVal?.id

    const { data: rowsArr, error } = await supabase
      .from('notes')
      .insert([{ ...newVal, owner_id: this.state.user.id }])
    if (error) console.error(error)
    
    // Update local store
    if (updateState) 
      this.state.notes.push(rowsArr[0])

    return rowsArr[0]
  },

  async notesUpdateSingle({ noteId, newVal, updateDB = true, updateState = true }) {
    try {
      if (updateDB) {
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
        const index = this.notesFindIndex({ noteId })
        const newData = { ...this.state.notes[index], ...newVal }
        this.state.notes[index] = newData
      }
    } catch (error) {
      this._handleError(error)
    }
  },

  async notesUpsert({ newVals, updateState = true }) {
    try {
      if (newVals.length === 0) return

      const { data, error } = await supabase
        .from('notes')
        .upsert(newVals.map(newVal => ({
          ...newVal,
          owner_id: this.state.user.id
        })))
      if (error) throw error

      data.forEach(note => {
        this.notesUpdateSingle({ noteId: note.id, newVal: note, updateDB: false })
      })

    } catch (error) {
      this._handleError(error)
    }
  },

  async notesUpdateSingleDeletedState({ noteId, deleted_at = new Date(), updateState = true }) {
    try {
      // Set deleted_at to now in database
      await this.notesUpdateSingle({ noteId, newVal: { deleted_at }, updateState })

      // Notify user
      if (updateState) {
        const index = this.notesFindIndex({ noteId })
        const noteData = this.state.notes[index]
        storeSnackbar.createSnackbar({ 
          message: `Moved note ${ noteData.title && `<b>"${ noteData.title }"</b>` } ${ deleted_at == null ? 'out of the' : 'to the' } Trash.`,
          buttonText: 'Undo',
          onButtonClick: () => {
            const newVal = { deleted_at: (deleted_at == null) ? new Date() : null }
            this.notesUpdateSingle({ noteId, newVal })
          }
        })
      }
    } catch (error) {
      this._handleError(error)
    }
  },

  async notesDeleteSingle({ noteId, updateState = true }) {
    try {
      // Delete from database
      const { error } = await supabase.from('notes').delete().eq('id', noteId)
      if (error) throw error

      // Delete from state
      if (updateState) {
        const index = this.notesFindIndex({ noteId })
        const noteData = this.state.notes[index]
        delete this.state.notes[index]

        storeSnackbar.createSnackbar({ message: `Deleted note ${ noteData.title && `<b>"${ noteData.title }"</b>` }` })
      }
    } catch (error) {
      this._handleError(error)
    }
  },

  notesFilter({ noteId = null, collectionId = null, showDeleted = false } = {}) {
    let notes = this.state.notes.filter(note => note !== undefined)

    // If noteId is set, return only that note.
    if (noteId)
      return notes.find(note => note.id === noteId)

    // Collections
    const joins = this.state.joinNotesCollections.filter(join => join.collection_id === collectionId)
    const noteIds = joins.map(join => join.note_id)

    notes = notes.filter(note => {
      if (collectionId !== null && !noteIds.includes(note.id)) return false
      return true
    })

    notes = notes.filter(note => {
      if (!showDeleted && note.deleted_at) return false
      if (showDeleted && !note.deleted_at) return false
      return true
    })

    notes = notes.filter(note => {
      if (!isHiddenMode.value && note.is_hidden) return false
      if (isHiddenMode.value && !note.is_hidden) return false
      return true
    })

    return notes
  },

  notesFindIndex({ noteId }) {
    return this.state.notes.findIndex(note => note !== undefined && note.id === noteId)
  },


  /**
   * Collections
   */
  async collectionsFetch() {
    const { data, error } = await supabase
      .from('collections')
      .select('*')

    if (error) 
      console.error(error)

    this.state.collections = data
  },

  collectionFindById({ collectionId }) {
    return this.state.collections.find(collection => collection.id === collectionId)
  },


  /**
   * Join Notes Collections
   */
  async joinNotesCollectionsFetch() {
    const { data, error } = await supabase
      .from('join_notes_collections')
      .select('*')

    if (error)
      console.error(error)

    this.state.joinNotesCollections = data
  },


  /**
   * Confirm Dialog State
   */
  confirmState: reactive({ ..._initialConfirmState }),

  resetConfirmState(){
    Object.assign(this.confirmState, _initialConfirmState)
  }
}