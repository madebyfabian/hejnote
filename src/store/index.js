import { reactive } from 'vue'
import { snackbarStore } from '@/store/snackbarStore' 
import { generalStore } from '@/store/generalStore'
import useSupabase from '@/hooks/useSupabase'
import useIsHiddenMode from '@/hooks/useIsHiddenMode'
import handleError from '@/utils/handleError'

const supabase = useSupabase(),
      isHiddenMode = useIsHiddenMode()


export const store = {
  /**
   * Default State
   */
  state: reactive({
    notes: [],
    links: [],
    collections: [],
    joinNotesCollections: [],
    joinNotesLinks: [],
  }),

  _findIndexById({ data, id }) {
    return data.findIndex(obj => obj !== undefined && obj.id === id)
  },

  _findLinksByNoteId({ noteId }) {
    const joins = this.state.joinNotesLinks.filter(join => join.note_id === noteId)
    return joins.map(join => {
      return this.state.links.find(link => link.id === join.link_id)
    })
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
      snackbarStore.createSnackbar({ 
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
      // Delete from database
      const { error } = await supabase.from('notes').delete().eq('id', noteId)
      if (error) throw error

      // Delete from state
      const index = this._findIndexById({ id: noteId, data: this.state.notes })
      const noteData = this.state.notes[index]
      delete this.state.notes[index]

      snackbarStore.createSnackbar({ message: `Deleted note ${ noteData.title && `<b>"${ noteData.title }"</b>` }` })
    
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
   * Join Notes Links
   */
  async joinNotesLinksFetch() {
    const { data, error } = await supabase
      .from('join_notes_links')
      .select('*')

    if (error)
      console.error(error)

    this.state.joinNotesLinks = data
  },

  async joinNotesLinksInsert({ newVals }) {
    await this.joinNotesLinksFetch()

    // Filter out duplicates
    newVals = newVals.filter(newVal => !this.state.joinNotesLinks.find(join => join.note_id === newVal.note_id && join.link_id === newVal.link_id))

    const { data, error } = await supabase
      .from('join_notes_links')
      .insert(newVals.map(newVal => ({
        ...newVal,
        owner_id: generalStore.state.user.id
      })))

    if (error)
      console.error(error)

    this.state.joinNotesLinks.push(...data)
  },

  async joinNotesLinksDelete({ urlArray, noteId }) {
    // Get all link.id's for this note
    const linkIds = urlArray.map(url => (this.state.links.find(link => link.url === url)).id)

    // Delete all joins for this note
    const { error } = await supabase
      .from('join_notes_links')
      .delete()
      .eq('note_id', noteId)
      .in('link_id', linkIds)
    if (error) console.error(error)

    // Remove deleted joins from state
    this.state.joinNotesLinks = this.state.joinNotesLinks.filter(join => !linkIds.includes(join.link_id))
  },


  /**
   * Links
   */
  async linksFetch() {
    const { data, error } = await supabase
      .from('links')
      .select('*')

    if (error)
      console.error(error)

    this.state.links = data
  },

  async linksInsert({ urlArray = [], noteId = null }) {
    // Update existing links
    await this.linksFetch()

    // Prepare new links
    const preparedData = [],
          preparedJoins = []
    for (const newVal of urlArray) {
      const existingLink = this.state.links.find(link => link.url === newVal)
      if (existingLink) {
        preparedJoins.push({ note_id: noteId, link_id: existingLink.id })
        continue
      }
      
      // Fetch metadata
      let metadata
      try {
        const metadataAPIUrl = 'https://netlify-functions-madebyfabian.netlify.app/.netlify/functions/meta-fetcher?url=' + newVal
        const metadataRes = await fetch(metadataAPIUrl)
        const json = await metadataRes.json()
        metadata = json?.metadata

      } catch (error) {
        console.error(error)
      }

      preparedData.push({
        url: newVal,
        title: metadata?.title || null,
        banner_url: metadata?.banner || null,
        owner_id: generalStore.state.user.id
      })
    }

    // If there are new links to insert into the DB, do this first.
    if (preparedData.length !== 0) {
      // Insert into database
      const { data, error } = await supabase
        .from('links')
        .insert(preparedData)
      if (error) console.error(error)

      // Update local state
      this.state.links.push(...data)

      // Update joins
      preparedJoins.push(...data.map(link => ({ note_id: noteId, link_id: link.id })))
    }

    // Then, if there are some new joins to insert, do this.
    if (preparedJoins.length !== 0) {
      this.joinNotesLinksInsert({ newVals: preparedJoins })
    }
  },

  async linksDelete({ urlArray, noteId }) {
    await this.joinNotesLinksDelete({ urlArray, noteId })

    // Delete all joins for this note
    const { error } = await supabase
      .from('links')
      .delete()
      .in('url', urlArray)
    if (error) console.error(error)

    // Remove deleted links from state
    this.state.links = this.state.links.filter(link => !urlArray.includes(link.url))
  },
}