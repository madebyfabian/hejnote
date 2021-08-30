import { reactive } from 'vue'
import useSnackbar from '@/hooks/useSnackbar'
import useSupabase from '@/hooks/useSupabase'
import useIsHiddenMode from '@/hooks/useIsHiddenMode'
import handleError from '@/utils/handleError'

import { generalStore } from '@/store/generalStore'
import { joinNotesCollectionsStore } from '@/store/joinNotesCollectionsStore'
import { linksStore } from '@/store/linksStore'

const supabase = useSupabase(),
			isHiddenMode = useIsHiddenMode()

export const notesStore = {
	state: reactive({
		notes: [],
	}),

	_findIndexById({ data, id }) {
    return data.findIndex(obj => obj !== undefined && obj.id === id)
  },

	async notesFetch() {
    const { data, error } = await supabase.from('notes').select('*')
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
    const index = this._findIndexById({ id: noteId, data: this.state.notes })
    if (index > -1)
      this.notesUpdateSingle({ noteId, newVal: rowsArr[0] })
    else
      this.state.notes.push(rowsArr[0])
  },

  async notesInsertSingle({ newVal, updateState = true }) {
    // Delete id column because it's not needed and supabase throws an error.
    newVal = { ...newVal }
    delete newVal?.id

    const { data: rowsArr, error } = await supabase
      .from('notes')
      .insert([{ ...newVal, owner_id: generalStore.state.user.id }])
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
        const index = this._findIndexById({ id: noteId, data: this.state.notes })
        const newData = { ...this.state.notes[index], ...newVal }
        this.state.notes[index] = newData
      }
    } catch (error) {
      handleError(error)
    }
  },

  async notesUpsert({ newVals }) {
    try {
      if (newVals.length === 0) return

      const { data, error } = await supabase
        .from('notes')
        .upsert(newVals.map(newVal => ({
          ...newVal,
          owner_id: generalStore.state.user.id
        })))
      if (error) throw error

      data.forEach(note => {
        this.notesUpdateSingle({ noteId: note.id, newVal: note, updateDB: false })
      })

    } catch (error) {
      handleError(error)
    }
  },

  async notesUpdateSingleDeletedState({ noteId, deleted_at = new Date() }) {
    try {
      // Set deleted_at to now in database
      await this.notesUpdateSingle({ noteId, newVal: { deleted_at } })

      // Notify
      const index = this._findIndexById({ id: noteId, data: this.state.notes })
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

  async notesDeleteSingle({ noteId }) {
    try {
      // Delete link joins and their links first.
      await linksStore.linksDelete({ noteId })
      
      // Delete from database
      const { error } = await supabase.from('notes').delete().eq('id', noteId)
      if (error) throw error

      // Delete from state
      const index = this._findIndexById({ id: noteId, data: this.state.notes })
      const noteData = this.state.notes[index]
      delete this.state.notes[index]

      useSnackbar().createSnackbar({ message: `Deleted note ${ noteData.title && `<b>"${ noteData.title }"</b>` }` })
    
    } catch (error) {
      handleError(error)
    }
  },

  notesFilter({ noteId = null, collectionId = null, showDeleted = false } = {}) {
    let notes = this.state.notes.filter(note => note !== undefined)

    // If noteId is set, return only that note.
    if (noteId)
      return notes.find(note => note.id === noteId)

    // Collections
    const joins = joinNotesCollectionsStore.state.joinNotesCollections.filter(join => join.collection_id === collectionId)
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
}